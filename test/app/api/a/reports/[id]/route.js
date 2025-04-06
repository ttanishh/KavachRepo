import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';
import { reportsService } from '@/lib/services/reports';
import { requireRole } from '@/lib/middleware/requireRole';

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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Verify that this report belongs to the admin's station
    if (report.stationId !== admin.stationId) {
      return NextResponse.json(
        { message: 'This report is not assigned to your police station' },
        { status: 403 }
      );
    }
    
    // Get media and updates
    const media = await reportsService.getReportMedia(id);
    const updates = await reportsService.getReportUpdates(id);
    
    return NextResponse.json({
      report,
      media,
      updates,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { message: 'Failed to fetch report', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Verify that this report belongs to the admin's station
    if (report.stationId !== admin.stationId) {
      return NextResponse.json(
        { message: 'This report is not assigned to your police station' },
        { status: 403 }
      );
    }
    
    // Get update data
    const { status, note } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Update report status
    const result = await reportsService.updateReportStatus(id, status, note, decoded.uid);
    
    return NextResponse.json({
      message: 'Report status updated successfully',
      report: result.report,
      update: result.update,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json(
      { message: 'Failed to update report status', error: error.message },
      { status: 500 }
    );
  }
}
