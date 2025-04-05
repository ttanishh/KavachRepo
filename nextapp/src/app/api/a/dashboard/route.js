import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, getDocs, orderBy, limit } from '@/lib/firebase';
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
    
    // Get admin details
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
    
    if (stationSnapshots.empty) {
      return NextResponse.json(
        { success: false, error: 'No police station assigned to this admin' },
        { status: 404 }
      );
    }
    
    const stationDoc = stationSnapshots.docs[0];
    const stationId = stationDoc.id;
    const stationData = stationDoc.data();
    
    // Get station's reports
    const reportsRef = crimeReports(db);
    const reportsQuery = query(
      reportsRef,
      where('assignedStationId', '==', stationId)
    );
    
    const reportsSnapshot = await getDocs(reportsQuery);
    
    // Count reports by status
    const statusCounts = {
      new: 0,
      in_review: 0,
      assigned: 0,
      resolved: 0,
      closed: 0
    };
    
    let totalReports = 0;
    
    reportsSnapshot.forEach(doc => {
      const report = doc.data();
      statusCounts[report.status]++;
      totalReports++;
    });
    
    // Get recent reports
    const recentReportsQuery = query(
      reportsRef,
      where('assignedStationId', '==', stationId),
      orderBy('reportedAt', 'desc'),
      limit(5)
    );
    
    const recentReportsSnapshot = await getDocs(recentReportsQuery);
    
    const recentReports = recentReportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate today's reports
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReportsQuery = query(
      reportsRef,
      where('assignedStationId', '==', stationId),
      where('reportedAt', '>=', today)
    );
    
    const todayReportsSnapshot = await getDocs(todayReportsQuery);
    
    // Return dashboard data
    return NextResponse.json({
      success: true,
      dashboard: {
        station: {
          id: stationId,
          name: stationData.name,
          address: stationData.address,
          contactNumber: stationData.contactNumber,
          email: stationData.email
        },
        stats: {
          totalReports,
          todayReports: todayReportsSnapshot.size,
          pendingReports: statusCounts.new + statusCounts.in_review + statusCounts.assigned,
          resolvedReports: statusCounts.resolved + statusCounts.closed,
          statusCounts
        },
        recentReports
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}