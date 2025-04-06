import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, getDocs, orderBy, limit } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';
import { policeStations } from '@/models/PoliceStation';
import { users } from '@/models/User';
import { admins } from '@/models/Admin';

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
    
    // Get system overview stats
    
    // 1. Total number of police stations
    const stationsRef = policeStations(db);
    const stationsSnapshot = await getDocs(stationsRef);
    const totalStations = stationsSnapshot.size;
    
    // 2. Total users
    const usersRef = users(db);
    const usersSnapshot = await getDocs(usersRef);
    const totalUsers = usersSnapshot.size;
    
    // 3. Total admins
    const adminsRef = admins(db);
    const adminsSnapshot = await getDocs(adminsRef);
    const totalAdmins = adminsSnapshot.size;
    
    // 4. Total reports and status counts
    const reportsRef = crimeReports(db);
    const reportsSnapshot = await getDocs(reportsRef);
    const totalReports = reportsSnapshot.size;
    
    // Count reports by status
    const statusCounts = {
      new: 0,
      in_review: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };
    
    reportsSnapshot.forEach(doc => {
      const report = doc.data();
      statusCounts[report.status]++;
    });
    
    // 5. Recent reports
    const recentReportsQuery = query(
      reportsRef,
      orderBy('reportedAt', 'desc'),
      limit(5)
    );
    
    const recentReportsSnapshot = await getDocs(recentReportsQuery);
    
    const recentReports = recentReportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 6. Today's reports
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReportsQuery = query(
      reportsRef,
      where('reportedAt', '>=', today)
    );
    
    const todayReportsSnapshot = await getDocs(todayReportsQuery);
    const todayReportsCount = todayReportsSnapshot.size;
    
    // 7. Top crime types
    const crimeTypeCounts = {};
    
    reportsSnapshot.forEach(doc => {
      const report = doc.data();
      crimeTypeCounts[report.crimeType] = (crimeTypeCounts[report.crimeType] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const topCrimeTypes = Object.entries(crimeTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Return dashboard data
    return NextResponse.json({
      success: true,
      dashboard: {
        totalStations,
        totalUsers,
        totalAdmins,
        reports: {
          total: totalReports,
          todayCount: todayReportsCount,
          statusCounts,
          pendingCount: statusCounts.new + statusCounts.in_review + statusCounts.assigned,
          resolvedCount: statusCounts.resolved + statusCounts.closed
        },
        recentReports,
        topCrimeTypes
      }
    });
  } catch (error) {
    console.error('SuperAdmin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}