import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';
import { reportsService } from '@/lib/services/reports';
import { requireRole } from '@/lib/middleware/requireRole';

export async function POST(request, { params }) {
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
    
    // Get comment content
    const { content } = await request.json();
    
    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      );
    }
    
    // Add comment
    const comment = await reportsService.addComment(id, {
      content,
      fromPolice: true,
      fromSuperAdmin: false,
      createdBy: decoded.uid,
      timestamp: new Date(),
    });
    
    return NextResponse.json({
      message: 'Comment added successfully',
      comment,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: 'Failed to add comment', error: error.message },
      { status: 500 }
    );
  }
}
