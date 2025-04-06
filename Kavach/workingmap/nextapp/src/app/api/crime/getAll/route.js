import { connectToDatabase } from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const timeFrame = searchParams.get('timeFrame');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    
    const { db } = await connectToDatabase();
    const collection = db.collection('crimes');

    // Build query
    let query = {};
    
    // Apply type filter if provided
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Apply time filter if provided
    if (timeFrame && timeFrame !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (timeFrame) {
        case 'day':
          cutoffDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        query.timestamp = { $gte: cutoffDate };
      }
    }
    
    // Apply geospatial filter if coordinates and radius provided
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }
    
    const crimes = await collection.find(query).sort({ timestamp: -1 }).toArray();
    
    return NextResponse.json({ success: true, data: crimes });
    
  } catch (error) {
    console.error('Error fetching crimes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch crime data' },
      { status: 500 }
    );
  }
}