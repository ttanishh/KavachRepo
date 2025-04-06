import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, getDocs, orderBy } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';
import { adminDoc } from '@/models/Admin';
import { policeStations } from '@/models/PoliceStation';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Verify admin role
    if (decoded.role !== 'admin' && decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    // Get admin's station
    const adminRef = adminDoc(db, decoded.userId);
    const adminSnapshot = await adminRef.get();
    
    if (!adminSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }
    
    // Find the police station for this admin
    const stationsRef = policeStations(db);
    const stationQuery = query(stationsRef, where('adminId', '==', adminSnapshot.id));
    const stationSnapshots = await getDocs(stationQuery);
    
    if (stationSnapshots.empty && decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'No police station assigned to this admin' },
        { status: 404 }
      );
    }
    
    const stationId = stationSnapshots.empty ? null : stationSnapshots.docs[0].id;
    
    // Get query parameters for time range
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'month'; // day, week, month, year
    
    // Calculate start date based on time range
    const startDate = new Date();
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1); // Default to month
    }
    
    // Query reports for this station in the given time range
    const reportsQuery = query(
      crimeReports(db),
      where('assignedStationId', '==', stationId),
      where('reportedAt', '>=', startDate),
      orderBy('reportedAt', 'asc')
    );
    
    const reportsSnapshot = await getDocs(reportsQuery);
    
    // Prepare data for statistics
    const reports = reportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate statistics
    const totalReports = reports.length;
    
    // Count by status
    const countByStatus = {
      new: 0,
      in_review: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };
    
    reports.forEach(report => {
      if (countByStatus[report.status] !== undefined) {
        countByStatus[report.status]++;
      }
    });
    
    // Count by crime type
    const countByCrimeType = {};
    reports.forEach(report => {
      countByCrimeType[report.crimeType] = (countByCrimeType[report.crimeType] || 0) + 1;
    });
    
    // Time-based analysis 
    let timeSeriesData;
    switch (timeRange) {
      case 'day':
        // Group by hour
        timeSeriesData = groupReportsByHour(reports);
        break;
      case 'week':
        // Group by day
        timeSeriesData = groupReportsByDay(reports);
        break;
      case 'month':
        // Group by day
        timeSeriesData = groupReportsByDay(reports);
        break;
      case 'year':
        // Group by month
        timeSeriesData = groupReportsByMonth(reports);
        break;
      default:
        timeSeriesData = groupReportsByDay(reports);
    }
    
    return NextResponse.json({
      success: true,
      stats: {
        totalReports,
        countByStatus,
        countByCrimeType,
        timeSeriesData,
        timeRange
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// Helper functions for grouping reports
function groupReportsByHour(reports) {
  const hourlyData = {};
  
  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = 0;
  }
  
  reports.forEach(report => {
    const hour = report.reportedAt.getHours();
    hourlyData[hour]++;
  });
  
  return Object.entries(hourlyData).map(([hour, count]) => ({
    time: `${hour}:00`,
    count
  }));
}

function groupReportsByDay(reports) {
  const dailyData = {};
  
  // Get date range
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30); // For month view
  
  // Initialize all days
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyData[dateStr] = 0;
  }
  
  reports.forEach(report => {
    const dateStr = report.reportedAt.toISOString().split('T')[0];
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr]++;
    }
  });
  
  return Object.entries(dailyData).map(([date, count]) => ({
    date,
    count
  }));
}

function groupReportsByMonth(reports) {
  const monthlyData = {};
  
  // Initialize all months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach(month => {
    monthlyData[month] = 0;
  });
  
  reports.forEach(report => {
    const month = months[report.reportedAt.getMonth()];
    monthlyData[month]++;
  });
  
  return Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count
  }));
}