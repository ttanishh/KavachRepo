import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { doc, getDoc, collection, query, where, getDocs } from '@/lib/firebase';
import { crimeReportDoc } from '@/models/CrimeReport';
import { adminDoc } from '@/models/Admin';
import { userDoc } from '@/models/User';
import { policeStations } from '@/models/PoliceStation';

export async function GET(request, { params }) {
  try {
    const reportId = params.id;
    
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
    
    // Get the report
    const reportRef = crimeReportDoc(db, reportId);
    const reportSnapshot = await getDoc(reportRef);
    
    if (!reportSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }
    
    const reportData = reportSnapshot.data();
    
    // Verify the report belongs to this admin's station (unless superadmin)
    if (decoded.role !== 'superAdmin' && reportData.assignedStationId !== stationId) {
      return NextResponse.json(
        { success: false, error: 'This report is not assigned to your station' },
        { status: 403 }
      );
    }
    
    // Get reporter details
    const reporterRef = userDoc(db, reportData.reporterId);
    const reporterSnapshot = await getDoc(reporterRef);
    
    let reporter = null;
    if (reporterSnapshot.exists()) {
      const reporterData = reporterSnapshot.data();
      reporter = {
        id: reporterSnapshot.id,
        username: reporterData.username,
        email: reporterData.email,
        phone: reporterData.phone,
        isEmergencyUser: reporterData.isEmergencyUser
      };
    }
    
    // Return report with reporter details
    return NextResponse.json({
      success: true,
      report: {
        id: reportSnapshot.id,
        ...reportData
      },
      reporter
    });
  } catch (error) {
    console.error('Admin get report error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch report details' },
      { status: 500 }
    );
  }
}