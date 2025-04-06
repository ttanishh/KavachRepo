import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { stationsService } from '@/lib/services/stations';
import { requireRole } from '@/lib/middleware/requireRole';
import { dateToTimestamp } from '@/lib/utils/dateToTimestamp';

export async function GET(request, { params }) {
  try {
    const { id } = params;

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

    // Get station
    const station = await stationsService.getStationById(id);
    
    if (!station) {
      return NextResponse.json(
        { message: 'Station not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ station }, { status: 200 });
  } catch (error) {
    console.error('Error fetching station:', error);
    return NextResponse.json(
      { message: 'Failed to fetch station', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;

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
      location,
      isActive
    } = await request.json();

    // Validate required fields
    if (!name || !district || !address || !location) {
      return NextResponse.json(
        { message: 'Name, district, address, and location are required' },
        { status: 400 }
      );
    }

    // Update station
    const stationData = {
      name,
      district,
      address,
      phone,
      email,
      location,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: dateToTimestamp(new Date()),
      updatedBy: decoded.uid
    };

    const updatedStation = await stationsService.updateStation(id, stationData);

    return NextResponse.json({
      message: 'Station updated successfully',
      station: updatedStation
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json(
      { message: 'Failed to update station', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

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

    // Check if station can be deleted
    const canDelete = await stationsService.canDeleteStation(id);
    
    if (!canDelete) {
      return NextResponse.json(
        { message: 'Cannot delete station with active reports. Deactivate the station instead.' },
        { status: 400 }
      );
    }

    // Delete station
    await stationsService.deleteStation(id);

    return NextResponse.json({
      message: 'Station deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting station:', error);
    return NextResponse.json(
      { message: 'Failed to delete station', error: error.message },
      { status: 500 }
    );
  }
}
