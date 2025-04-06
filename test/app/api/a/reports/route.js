import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';
import { reportsService } from '@/lib/services/reports';
import { requireRole } from '@/lib/middleware/requireRole';

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

    // Check if user is an admin
    const roleCheck = await requireRole(decoded, ['admin']);
    if (!roleCheck.success) {
      return NextResponse.json(
        { message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    // Get admin details
    const admin = await usersService.getAdminByUserId(decoded.uid);
    
    if (!admin || !admin.stationId) {
      return NextResponse.json(
        { message: 'No police station associated with this account' },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || null;
    const crimeType = searchParams.get('crimeType') || null;
    const timeframe = searchParams.get('timeframe') || null;

    // Get reports for this station with filters
    const reports = await reportsService.getReportsByStationId(
      admin.stationId, 
      { status, crimeType, timeframe }
    );

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reports', error: error.message },
      { status: 500 }
    );
  }
}
