import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
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
    const timeRange = searchParams.get('timeRange') || 'month';
    const district = searchParams.get('district') || null;

    // Get statistics
    const stats = await reportsService.getReportStats(timeRange, district);

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { message: 'Failed to fetch statistics', error: error.message },
      { status: 500 }
    );
  }
}
