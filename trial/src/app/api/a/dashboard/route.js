import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { usersService } from '@/lib/services/users';
import { reportsService } from '@/lib/services/reports';
import { stationsService } from '@/lib/services/stations';
import { requireRole } from '@/lib/middleware/requireRole';

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

    // Get station data
    const station = await stationsService.getStationById(admin.stationId);
    
    if (!station) {
      return NextResponse.json(
        { message: 'Police station not found' },
        { status: 404 }
      );
    }

    // Get reports for this station
    const reports = await reportsService.getReportsByStationId(admin.stationId);
    
    // Calculate statistics
    const stats = {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      investigatingReports: reports.filter(r => r.status === 'investigating').length,
      resolvedReports: reports.filter(r => r.status === 'resolved').length,
      closedReports: reports.filter(r => r.status === 'closed').length,
      urgentReports: reports.filter(r => r.isUrgent).length,
      reportsByStatus: [
        { name: 'Pending', value: reports.filter(r => r.status === 'pending').length },
        { name: 'Investigating', value: reports.filter(r => r.status === 'investigating').length },
        { name: 'Resolved', value: reports.filter(r => r.status === 'resolved').length },
        { name: 'Closed', value: reports.filter(r => r.status === 'closed').length },
      ],
      stationInfo: {
        name: station.name,
        district: station.district,
        address: station.address,
      }
    };
    
    // Calculate crime type distribution
    const crimeTypes = {};
    reports.forEach(report => {
      if (report.crimeType) {
        crimeTypes[report.crimeType] = (crimeTypes[report.crimeType] || 0) + 1;
      }
    });
    
    stats.crimeTypeDistribution = Object.entries(crimeTypes).map(([name, value]) => ({ name, value }));
    
    // Get recent reports (5 most recent)
    const recentReports = reports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return NextResponse.json({
      stats,
      recentReports,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data', error: error.message },
      { status: 500 }
    );
  }
}
