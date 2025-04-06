import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, getDocs, orderBy } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Check if user has permission (admin or superAdmin)
    if (decoded.role !== 'admin' && decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'month'; // day, week, month, year, all
    const crimeType = searchParams.get('crimeType'); // optional filter by crime type
    const boundingBox = {
      north: parseFloat(searchParams.get('north')),
      south: parseFloat(searchParams.get('south')),
      east: parseFloat(searchParams.get('east')),
      west: parseFloat(searchParams.get('west'))
    };
    
    // Validate bounding box parameters
    const hasBoundingBox = !Object.values(boundingBox).some(isNaN);
    
    // Calculate start date based on time range
    let startDate;
    if (timeRange !== 'all') {
      startDate = new Date();
      switch (timeRange) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
    }
    
    // Build query for reports
    let reportsQuery;
    if (startDate) {
      reportsQuery = query(
        crimeReports(db),
        where('reportedAt', '>=', startDate),
        orderBy('reportedAt', 'desc')
      );
    } else {
      reportsQuery = query(
        crimeReports(db),
        orderBy('reportedAt', 'desc')
      );
    }
    
    // Add crime type filter if provided
    if (crimeType) {
      if (startDate) {
        reportsQuery = query(
          crimeReports(db),
          where('crimeType', '==', crimeType),
          where('reportedAt', '>=', startDate),
          orderBy('reportedAt', 'desc')
        );
      } else {
        reportsQuery = query(
          crimeReports(db),
          where('crimeType', '==', crimeType),
          orderBy('reportedAt', 'desc')
        );
      }
    }
    
    const reportsSnapshot = await getDocs(reportsQuery);
    
    // Format reports for heatmap, filtering by bounding box if provided
    const heatmapPoints = [];
    
    reportsSnapshot.forEach(doc => {
      const report = doc.data();
      const { lat, lng } = report.location;
      
      // Skip if outside bounding box (when bounding box is provided)
      if (hasBoundingBox && (
        lat > boundingBox.north || 
        lat < boundingBox.south || 
        lng > boundingBox.east || 
        lng < boundingBox.west
      )) {
        return;
      }
      
      heatmapPoints.push({
        lat,
        lng,
        weight: 1, // Could vary weight by crime severity in the future
        crimeType: report.crimeType,
        reportId: doc.id,
        reportedAt: report.reportedAt
      });
    });
    
    return NextResponse.json({
      success: true,
      heatmapData: {
        points: heatmapPoints,
        timeRange
      }
    });
  } catch (error) {
    console.error('Heatmap data error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch heatmap data' },
      { status: 500 }
    );
  }
}