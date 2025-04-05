import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { collection, addDoc, getDocs, query, orderBy, limit } from '@/lib/firebase';
import { policeStations } from '@/models/PoliceStation';
import { adminDoc } from '@/models/Admin';

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
    
    // Verify superAdmin role
    if (decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query for stations
    const stationsQuery = query(
      policeStations(db),
      orderBy('name', 'asc'),
      limit(limitParam)
    );
    
    const stationsSnapshot = await getDocs(stationsQuery);
    
    // Format station data and fetch admin details where available
    const stationsPromises = stationsSnapshot.docs.map(async (doc) => {
      const station = doc.data();
      
      // If station has an admin, fetch admin details
      let admin = null;
      if (station.adminId) {
        const adminRef = adminDoc(db, station.adminId);
        const adminSnapshot = await adminRef.get();
        
        if (adminSnapshot.exists()) {
          const adminData = adminSnapshot.data();
          admin = {
            id: adminSnapshot.id,
            name: adminData.name,
            email: adminData.email,
            phoneNumber: adminData.phoneNumber
          };
        }
      }
      
      return {
        id: doc.id,
        ...station,
        admin
      };
    });
    
    const stations = await Promise.all(stationsPromises);
    
    return NextResponse.json({
      success: true,
      stations,
      pagination: {
        total: stations.length,
        page,
        limit: limitParam
      }
    });
  } catch (error) {
    console.error('List stations error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    
    // Verify superAdmin role
    if (decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    const {
      name,
      address,
      location,
      adminId,
      contactNumber,
      email
    } = await request.json();
    
    // Validate required fields
    if (!name || !address || !location || !location.lat || !location.lng) {
      return NextResponse.json(
        { success: false, error: 'Name, address, and location are required' },
        { status: 400 }
      );
    }
    
    // Create the new police station
    const stationData = {
      name,
      address,
      location: {
        lat: location.lat,
        lng: location.lng
      },
      adminId: adminId || null,
      contactNumber: contactNumber || null,
      email: email || null,
      createdAt: new Date()
    };
    
    const stationsRef = policeStations(db);
    const stationRef = await addDoc(stationsRef, stationData);
    
    return NextResponse.json({
      success: true,
      message: 'Police station created successfully',
      stationId: stationRef.id
    });
  } catch (error) {
    console.error('Create station error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create police station' },
      { status: 500 }
    );
  }
}