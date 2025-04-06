import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { reportsService } from '@/lib/services/reports';
import { stationsService } from '@/lib/services/stations';
import { usersService } from '@/lib/services/users';
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

    // Check if user is a superadmin
    const roleCheck = await requireRole(decoded, ['superadmin']);
    if (!roleCheck.success) {
      return NextResponse.json(
        { message: roleCheck.error },
        { status: roleCheck.status }
      );
    }

    // Get reports statistics
    const allReports = await reportsService.getAllReports({}, 1000);
    const stations = await stationsService.getAllStations();
    
    // Calculate statistics
    const stats = {
      totalReports: allReports.length,
      totalStations: stations.length,
      activeStations: stations.filter(s => s.isActive).length,
      pendingReports: allReports.filter(r => r.status === 'pending').length,
      investigatingReports: allReports.filter(r => r.status === 'investigating').length,
      resolvedReports: allReports.filter(r => r.status === 'resolved').length,
      closedReports: allReports.filter(r => r.status === 'closed').length,
      urgentReports: allReports.filter(r => r.isUrgent).length,
      reportsByStatus: [
        { name: 'Pending', value: allReports.filter(r => r.status === 'pending').length },
        { name: 'Investigating', value: allReports.filter(r => r.status === 'investigating').length },
        { name: 'Resolved', value: allReports.filter(r => r.status === 'resolved').length },
        { name: 'Closed', value: allReports.filter(r => r.status === 'closed').length },
      ],
    };
    
    // Calculate district distribution
    const districtStats = {};
    allReports.forEach(report => {
      const district = report.district || 'Unknown';
      districtStats[district] = (districtStats[district] || 0) + 1;
    });
    
    stats.districtDistribution = Object.entries(districtStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Recent reports and stations
    const recentReports = allReports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
      
    const recentStations = stations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return NextResponse.json({
      stats,
      recentReports,
      recentStations,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data', error: error.message },
      { status: 500 }
    );
  }
}
