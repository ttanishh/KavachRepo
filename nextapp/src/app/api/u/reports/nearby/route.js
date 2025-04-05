import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, query, where, orderBy, limit, getDocs } from '@/lib/firebase';
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const radiusKm = parseFloat(searchParams.get('radius') || '5');
    const maxResults = parseInt(searchParams.get('limit') || '10');
    
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Valid latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    // Get reports from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const reportsRef = crimeReports(db);
    const q = query(
      reportsRef,
      where('reportedAt', '>=', thirtyDaysAgo),
      orderBy('reportedAt', 'desc'),
      limit(100) // Fetch more than we need to filter by distance
    );
    
    const querySnapshot = await getDocs(q);
    
    // Calculate distance for each report and filter by radius
    const nearbyReports = [];
    
    querySnapshot.forEach(doc => {
      const report = doc.data();
      const reportLocation = report.location;
      
      const distance = calculateDistance(
        lat, 
        lng, 
        reportLocation.lat, 
        reportLocation.lng
      );
      
      if (distance <= radiusKm) {
        nearbyReports.push({
          id: doc.id,
          ...report,
          distance: parseFloat(distance.toFixed(2))
        });
      }
    });
    
    // Sort by distance and limit results
    nearbyReports.sort((a, b) => a.distance - b.distance);
    const limitedResults = nearbyReports.slice(0, maxResults);
    
    return NextResponse.json({
      success: true,
      reports: limitedResults
    });
  } catch (error) {
    console.error('Get nearby reports error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch nearby reports' },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}