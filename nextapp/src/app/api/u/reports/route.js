import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from '@/lib/firebase';
import { getStationByLocation } from '@/lib/geo';
import { crimeReports } from '@/models/CrimeReport';

export async function POST(request) {
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

    const { 
      crimeType, 
      description, 
      occurredAt, 
      location, 
      mediaUrls = [] 
    } = await request.json();

    // Validate required fields
    if (!crimeType || !location || !location.lat || !location.lng) {
      return NextResponse.json(
        { success: false, error: 'Crime type and location are required' },
        { status: 400 }
      );
    }

    // Determine which police station to assign based on location
    const assignedStation = await getStationByLocation(location.lat, location.lng);

    if (!assignedStation) {
      return NextResponse.json(
        { success: false, error: 'Could not determine which police station to assign' },
        { status: 400 }
      );
    }

    // Create the report
    const reportData = {
      reporterId: decoded.userId,
      crimeType,
      description: description || null,
      occurredAt: occurredAt ? new Date(occurredAt) : null,
      reportedAt: new Date(),
      status: 'new',
      location: { lat: location.lat, lng: location.lng },
      mediaUrls,
      assignedStationId: assignedStation.id,
      createdAt: new Date()
    };

    const reportsRef = crimeReports(db);
    const reportRef = await addDoc(reportsRef, reportData);

    return NextResponse.json({
      success: true,
      reportId: reportRef.id,
      assignedStation: {
        id: assignedStation.id,
        name: assignedStation.name
      }
    });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create report' },
      { status: 500 }
    );
  }
}

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    
    // Query reports
    const reportsRef = crimeReports(db);
    let q = query(reportsRef, where('reporterId', '==', decoded.userId));
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(limitParam));
    
    const reportSnapshots = await getDocs(q);
    
    // Format reports
    const reports = reportSnapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        total: reports.length,
        page,
        limit: limitParam
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}