import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from '@/lib/firebase';
import { crimeReportDoc } from '@/models/CrimeReport';
import { adminDoc } from '@/models/Admin';
import { policeStations } from '@/models/PoliceStation';

export async function PATCH(request, { params }) {
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

    const { status, notes } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Validate status value
    const validStatuses = ['new', 'in_review', 'assigned', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
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
    
    // Update the report status
    const updateData = {
      status,
      lastUpdated: new Date(),
      lastUpdatedBy: decoded.userId
    };
    
    if (notes) {
      // Add notes if provided
      if (!reportData.notes) {
        updateData.notes = [{ text: notes, addedBy: decoded.userId, addedAt: new Date() }];
      } else {
        updateData.notes = [...reportData.notes, { text: notes, addedBy: decoded.userId, addedAt: new Date() }];
      }
    }
    
    await updateDoc(reportRef, updateData);
    
    return NextResponse.json({
      success: true,
      message: `Report status updated to ${status}`
    });
  } catch (error) {
    console.error('Update report status error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update report status' },
      { status: 500 }
    );
  }
}