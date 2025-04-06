import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, orderBy, limit, getDocs } from '@/lib/firebase';
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
    
    if (stationSnapshots.empty) {
      return NextResponse.json(
        { success: false, error: 'No police station assigned to this admin' },
        { status: 404 }
      );
    }
    
    const stationId = stationSnapshots.docs[0].id;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const crimeType = searchParams.get('crimeType');
    const sortBy = searchParams.get('sortBy') || 'reportedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query for the station's reports
    let reportsQuery = query(
      crimeReports(db),
      where('assignedStationId', '==', stationId)
    );
    
    // Add filters if provided
    if (status) {
      reportsQuery = query(reportsQuery, where('status', '==', status));
    }
    
    if (crimeType) {
      reportsQuery = query(reportsQuery, where('crimeType', '==', crimeType));
    }
    
    // Add sorting
    reportsQuery = query(reportsQuery, orderBy(sortBy, sortOrder));
    
    // Add pagination
    reportsQuery = query(reportsQuery, limit(limitParam));
    
    // Fetch reports
    const reportsSnapshot = await getDocs(reportsQuery);
    
    const reports = reportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get total count for pagination info
    const totalQuery = query(
      crimeReports(db),
      where('assignedStationId', '==', stationId)
    );
    
    if (status) {
      totalQuery = query(totalQuery, where('status', '==', status));
    }
    
    if (crimeType) {
      totalQuery = query(totalQuery, where('crimeType', '==', crimeType));
    }
    
    const totalSnapshot = await getDocs(totalQuery);
    const totalReports = totalSnapshot.size;
    
    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        total: totalReports,
        page,
        limit: limitParam,
        totalPages: Math.ceil(totalReports / limitParam)
      }
    });
  } catch (error) {
    console.error('Admin list reports error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}