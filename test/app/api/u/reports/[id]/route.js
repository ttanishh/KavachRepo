import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { reportsService } from '@/lib/services/reports';
import { dateToTimestamp } from '@/lib/utils/dateToTimestamp';

// Get a specific report
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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - user must own the report unless it's anonymous
    if (report.reporterId !== decoded.uid && !report.isAnonymous) {
      return NextResponse.json(
        { message: 'You are not authorized to view this report' },
        { status: 403 }
      );
    }
    
    // Get media and updates for the report
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
      { message: 'Failed to fetch report details', error: error.message },
      { status: 500 }
    );
  }
}

// Update a report
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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - user must own the report
    if (report.reporterId !== decoded.uid) {
      return NextResponse.json(
        { message: 'You are not authorized to update this report' },
        { status: 403 }
      );
    }
    
    // Check if report can be edited (must be in pending state)
    if (report.status !== 'pending') {
      return NextResponse.json(
        { message: 'This report cannot be edited because it is already being processed' },
        { status: 400 }
      );
    }
    
    // Get update data
    const { title, description, isUrgent, isAnonymous } = await request.json();
    
    // Update report
    const updatedReport = await reportsService.updateReport(id, {
      title,
      description,
      isUrgent,
      isAnonymous,
      updatedAt: dateToTimestamp(new Date()),
    });
    
    return NextResponse.json({
      message: 'Report updated successfully',
      report: updatedReport,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { message: 'Failed to update report', error: error.message },
      { status: 500 }
    );
  }
}

// Delete a report
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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - user must own the report
    if (report.reporterId !== decoded.uid) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this report' },
        { status: 403 }
      );
    }
    
    // Check if report can be deleted (must be in pending state)
    if (report.status !== 'pending') {
      return NextResponse.json(
        { message: 'This report cannot be deleted because it is already being processed' },
        { status: 400 }
      );
    }
    
    // Delete report
    await reportsService.deleteReport(id);
    
    return NextResponse.json({
      message: 'Report deleted successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { message: 'Failed to delete report', error: error.message },
      { status: 500 }
    );
  }
}
