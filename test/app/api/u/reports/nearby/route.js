import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { reportsService } from '@/lib/services/reports';
import { geoAssign } from '@/lib/utils/geoAssign';

export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10'; // Default to 10km
    const timeframe = searchParams.get('timeframe') || 'all';
    const crimeType = searchParams.get('crimeType') || '';

    // Validate coordinates
    if (!lat || !lng) {
      return NextResponse.json(
        { message: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusInKm)) {
      return NextResponse.json(
        { message: 'Invalid coordinates or radius' },
        { status: 400 }
      );
    }

    // Determine time threshold based on timeframe
    let timeThreshold = null;
    if (timeframe !== 'all') {
      timeThreshold = new Date();
      
      switch (timeframe) {
        case 'today':
          timeThreshold.setHours(0, 0, 0, 0);
          break;
        case 'week':
          timeThreshold.setDate(timeThreshold.getDate() - 7);
          break;
        case 'month':
          timeThreshold.setMonth(timeThreshold.getMonth() - 1);
          break;
        case 'year':
          timeThreshold.setFullYear(timeThreshold.getFullYear() - 1);
          break;
      }
    }

    // Get nearby reports
    const reports = await reportsService.getNearbyReports({
      latitude,
      longitude,
      radiusInKm,
      timeThreshold,
      crimeType: crimeType || null,
      limit: 100,
    });

    // Calculate distance for each report
    const reportsWithDistance = reports.map(report => {
      const distance = geoAssign.calculateDistance(
        latitude, 
        longitude, 
        report.location.lat, 
        report.location.lng
      );
      
      return {
        ...report,
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    // Sort by distance
    reportsWithDistance.sort((a, b) => a.distance - b.distance);

    return NextResponse.json({
      reports: reportsWithDistance,
      center: { lat: latitude, lng: longitude },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching nearby reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch nearby reports', error: error.message },
      { status: 500 }
    );
  }
}
