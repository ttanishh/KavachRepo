import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, orderBy, limit, getDocs } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';

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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const crimeType = searchParams.get('crimeType');
    const stationId = searchParams.get('stationId');
    const sortBy = searchParams.get('sortBy') || 'reportedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query for reports
    let reportsQuery = query(crimeReports(db));
    
    // Add filters if provided
    if (status) {
      reportsQuery = query(reportsQuery, where('status', '==', status));
    }
    
    if (crimeType) {
      reportsQuery = query(reportsQuery, where('crimeType', '==', crimeType));
    }
    
    if (stationId) {
      reportsQuery = query(reportsQuery, where('assignedStationId', '==', stationId));
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
    
    // Get total count for pagination info (simplified approach)
    let totalReports = reports.length;
    if (reports.length === limitParam) {
      // If we got exactly the limit, there may be more
      totalReports = limitParam * page + 1; // Indicate there are more
    } else if (page > 1) {
      totalReports = limitParam * (page - 1) + reports.length;
    }
    
    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        total: totalReports,
        page,
        limit: limitParam,
        hasMore: reports.length === limitParam
      }
    });
  } catch (error) {
    console.error('SuperAdmin list reports error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}