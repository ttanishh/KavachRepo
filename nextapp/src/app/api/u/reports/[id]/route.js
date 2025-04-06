import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { doc, getDoc, updateDoc, deleteDoc } from '@/lib/firebase';
import { crimeReportDoc } from '@/models/CrimeReport';
import { policeStationDoc } from '@/models/PoliceStation';

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
    
    // Verify ownership of report or admin access
    if (reportData.reporterId !== decoded.userId && 
        decoded.role !== 'admin' && 
        decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this report' },
        { status: 403 }
      );
    }
    
    // Get station details
    const stationRef = policeStationDoc(db, reportData.assignedStationId);
    const stationSnapshot = await getDoc(stationRef);
    
    let station = null;
    if (stationSnapshot.exists()) {
      const stationData = stationSnapshot.data();
      station = {
        id: stationSnapshot.id,
        name: stationData.name,
        address: stationData.address,
        contactNumber: stationData.contactNumber,
        email: stationData.email
      };
    }
    
    return NextResponse.json({
      success: true,
      report: {
        id: reportSnapshot.id,
        ...reportData
      },
      station
    });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const { 
      crimeType, 
      description,
      occurredAt,
      mediaUrls
    } = await request.json();
    
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
    
    // Verify ownership of report
    if (reportData.reporterId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this report' },
        { status: 403 }
      );
    }
    
    // Check if report is in an updatable state
    if (reportData.status !== 'new' && reportData.status !== 'in_review') {
      return NextResponse.json(
        { success: false, error: 'This report cannot be updated anymore' },
        { status: 400 }
      );
    }
    
    // Update the report
    const updateData = {};
    
    if (crimeType) updateData.crimeType = crimeType;
    if (description !== undefined) updateData.description = description;
    if (occurredAt) updateData.occurredAt = new Date(occurredAt);
    if (mediaUrls) updateData.mediaUrls = mediaUrls;
    
    await updateDoc(reportRef, updateData);
    
    return NextResponse.json({
      success: true,
      message: 'Report updated successfully'
    });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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
    
    // Verify ownership of report
    if (reportData.reporterId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this report' },
        { status: 403 }
      );
    }
    
    // Check if report is in a deletable state (only 'new' reports can be deleted)
    if (reportData.status !== 'new') {
      return NextResponse.json(
        { success: false, error: 'This report cannot be deleted anymore' },
        { status: 400 }
      );
    }
    
    // Delete the report
    await deleteDoc(reportRef);
    
    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete report' },
      { status: 500 }
    );
  }
}