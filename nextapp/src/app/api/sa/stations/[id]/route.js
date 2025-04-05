import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { doc, getDoc, updateDoc, deleteDoc } from '@/lib/firebase';
import { policeStationDoc } from '@/models/PoliceStation';
import { adminDoc } from '@/models/Admin';

export async function GET(request, { params }) {
  try {
    const stationId = params.id;
    
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
    
    // Verify admin or superAdmin role
    if (decoded.role !== 'admin' && decoded.role !== 'superAdmin') {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access this resource' },
        { status: 403 }
      );
    }
    
    // Get the station
    const stationRef = policeStationDoc(db, stationId);
    const stationSnapshot = await getDoc(stationRef);
    
    if (!stationSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Police station not found' },
        { status: 404 }
      );
    }
    
    const station = stationSnapshot.data();
    
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
    
    return NextResponse.json({
      success: true,
      station: {
        id: stationSnapshot.id,
        ...station,
        admin
      }
    });
  } catch (error) {
    console.error('Get station error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch station details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const stationId = params.id;
    
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
    
    // Get the station
    const stationRef = policeStationDoc(db, stationId);
    const stationSnapshot = await getDoc(stationRef);
    
    if (!stationSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Police station not found' },
        { status: 404 }
      );
    }
    
    // Update station data
    const updateData = {};
    
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (location && location.lat && location.lng) {
      updateData.location = { lat: location.lat, lng: location.lng };
    }
    if (adminId !== undefined) updateData.adminId = adminId;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (email !== undefined) updateData.email = email;
    
    await updateDoc(stationRef, updateData);
    
    return NextResponse.json({
      success: true,
      message: 'Police station updated successfully'
    });
  } catch (error) {
    console.error('Update station error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update police station' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const stationId = params.id;
    
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
    
    // Get the station
    const stationRef = policeStationDoc(db, stationId);
    const stationSnapshot = await getDoc(stationRef);
    
    if (!stationSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Police station not found' },
        { status: 404 }
      );
    }
    
    // Check if there are reports assigned to this station (production code would implement this)
    // For safety, don't allow deletion of stations with assigned reports
    
    // Delete the station
    await deleteDoc(stationRef);
    
    return NextResponse.json({
      success: true,
      message: 'Police station deleted successfully'
    });
  } catch (error) {
    console.error('Delete station error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete police station' },
      { status: 500 }
    );
  }
}