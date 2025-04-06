import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { reportsService } from '@/lib/services/reports';
import { stationsService } from '@/lib/services/stations';
import { geoAssign } from '@/lib/utils/geoAssign';
import { dateToTimestamp } from '@/lib/utils/dateToTimestamp';

// Get user's reports
export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user's reports
    const reports = await reportsService.getReportsByUserId(decoded.uid);
    
    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports', error: error.message },
      { status: 500 }
    );
  }
}

// Create a new report
export async function POST(request) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { 
      title, 
      description, 
      crimeType, 
      location, 
      address,
      timestamp,
      isAnonymous,
      isUrgent 
    } = await request.json();

    // Validate required fields
    if (!title || !description || !crimeType || !location || !timestamp) {
      return NextResponse.json(
        { message: 'Title, description, crime type, location, and timestamp are required' },
        { status: 400 }
      );
    }

    // Get district and formatted address from coordinates
    const geoInfo = await geoAssign.getDistrictFromCoordinates(location);
    
    // Find nearest police station
    const nearestStation = await stationsService.findNearestStation(location, geoInfo.district);
    
    // Prepare report data
    const reportData = {
      title,
      description,
      crimeType,
      location,
      address: address || geoInfo.formattedAddress || 'Address not available',
      timestamp: dateToTimestamp(new Date(timestamp)),
      isAnonymous: isAnonymous || false,
      isUrgent: isUrgent || false,
      status: 'pending',
      reporterId: decoded.uid,
      district: geoInfo.district,
      createdAt: dateToTimestamp(new Date()),
    };

    // Add station ID if a nearest station was found
    if (nearestStation) {
      reportData.stationId = nearestStation.id;
    }

    // Create report
    const report = await reportsService.createReport(reportData);

    // Notify about urgent report
    if (isUrgent && nearestStation) {
      await reportsService.notifyStationAboutUrgentReport(nearestStation.id, report.id, crimeType);
    }

    return NextResponse.json({
      message: 'Report submitted successfully',
      reportId: report.id,
      assignedStation: nearestStation ? { name: nearestStation.name } : null,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { message: 'Failed to create report', error: error.message },
      { status: 500 }
    );
  }
}
