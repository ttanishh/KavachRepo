import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { stationsService } from '@/lib/services/stations';
import { requireRole } from '@/lib/middleware/requireRole';
import { dateToTimestamp } from '@/lib/utils/dateToTimestamp';

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

    // Check if user is a superadmin
    const roleCheck = await requireRole(decoded, ['superadmin']);
    if (!roleCheck.success) {
      return NextResponse.json(
        { message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const district = searchParams.get('district') || null;

    // Get stations with filters
    const stations = await stationsService.getAllStations(activeOnly, district);

    return NextResponse.json({ stations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stations', error: error.message },
      { status: 500 }
    );
  }
}

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

    // Check if user is a superadmin
    const roleCheck = await requireRole(decoded, ['superadmin']);
    if (!roleCheck.success) {
      return NextResponse.json(
        { message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    // Get request data
    const { 
      name, 
      district, 
      address, 
      phone, 
      email,
      location 
    } = await request.json();

    // Validate required fields
    if (!name || !district || !address || !location) {
      return NextResponse.json(
        { message: 'Name, district, address, and location are required' },
        { status: 400 }
      );
    }

    // Create station
    const stationData = {
      name,
      district,
      address,
      phone,
      email,
      location,
      isActive: true,
      createdAt: dateToTimestamp(new Date()),
      createdBy: decoded.uid
    };

    const station = await stationsService.createStation(stationData);

    return NextResponse.json({
      message: 'Police station created successfully',
      station
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json(
      { message: 'Failed to create station', error: error.message },
      { status: 500 }
    );
  }
}
