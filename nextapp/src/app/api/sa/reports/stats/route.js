import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, getDocs, orderBy } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';
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
    
    // Verify superAdmin role
    if (decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    // Get query parameters for time range and other filters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'month'; // day, week, month, year, all
    const stationId = searchParams.get('stationId'); // Optional: Filter by station
    
    // Calculate start date based on time range
    let startDate;
    if (timeRange !== 'all') {
      startDate = new Date();
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
      }
    }
    
    // Build query for reports
    let reportsQuery;
    if (startDate) {
      reportsQuery = query(
        crimeReports(db),
        where('reportedAt', '>=', startDate),
        orderBy('reportedAt', 'asc')
      );
    } else {
      reportsQuery = query(
        crimeReports(db),
        orderBy('reportedAt', 'asc')
      );
    }
    
    // Add station filter if provided
    if (stationId) {
      reportsQuery = query(
        crimeReports(db),
        where('assignedStationId', '==', stationId)
      );
      
      if (startDate) {
        reportsQuery = query(
          reportsQuery,
          where('reportedAt', '>=', startDate),
          orderBy('reportedAt', 'asc')
        );
      }
    }
    
    const reportsSnapshot = await getDocs(reportsQuery);
    
    // Get all stations for reference
    const stationsRef = policeStations(db);
    const stationsSnapshot = await getDocs(stationsRef);
    const stationsMap = {};
    
    stationsSnapshot.forEach(doc => {
      stationsMap[doc.id] = doc.data().name;
    });
    
    // Prepare reports data
    const reports = reportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      stationName: stationsMap[doc.data().assignedStationId] || 'Unknown Station'
    }));
    
    // Calculate statistics
    
    // 1. Total reports
    const totalReports = reports.length;
    
    // 2. Count by crime type
    const crimeTypeCounts = {};
    reports.forEach(report => {
      crimeTypeCounts[report.crimeType] = (crimeTypeCounts[report.crimeType] || 0) + 1;
    });
    
    // 3. Count by status
    const statusCounts = {
      new: 0,
      in_review: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };
    
    reports.forEach(report => {
      if (statusCounts[report.status] !== undefined) {
        statusCounts[report.status]++;
      }
    });
    
    // 4. Count by station
    const stationCounts = {};
    reports.forEach(report => {
      const stationName = report.stationName;
      stationCounts[stationName] = (stationCounts[stationName] || 0) + 1;
    });
    
    // 5. Time series data
    let timeSeriesData;
    switch (timeRange) {
      case 'day':
        // Group by hour
        timeSeriesData = groupReportsByHour(reports);
        break;
      case 'week':
      case 'month':
        // Group by day
        timeSeriesData = groupReportsByDay(reports);
        break;
      case 'year':
        // Group by month
        timeSeriesData = groupReportsByMonth(reports);
        break;
      default:
        // For 'all', show by month for the last year
        timeSeriesData = groupReportsByMonth(
          reports.filter(r => r.reportedAt >= new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
        );
    }
    
    // 6. Resolution rate per station
    const stationResolutionRates = {};
    
    Object.keys(stationCounts).forEach(station => {
      const stationReports = reports.filter(r => r.stationName === station);
      const resolvedCount = stationReports.filter(r => 
        r.status === 'resolved' || r.status === 'closed'
      ).length;
      
      stationResolutionRates[station] = {
        total: stationReports.length,
        resolved: resolvedCount,
        rate: stationReports.length > 0 
          ? Math.round((resolvedCount / stationReports.length) * 100) 
          : 0
      };
    });
    
    return NextResponse.json({
      success: true,
      timeRange,
      stats: {
        totalReports,
        crimeTypeCounts,
        statusCounts,
        stationCounts,
        timeSeriesData,
        stationResolutionRates
      }
    });
  } catch (error) {
    console.error('SuperAdmin stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// Helpers for grouping reports (same as in admin routes)
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
  
  return months.map(month => ({
    month,
    count: monthlyData[month]
  }));
}