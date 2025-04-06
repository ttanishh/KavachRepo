import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc, arrayUnion } from '@/lib/firebase';
import { crimeReportDoc } from '@/models/CrimeReport';

export async function POST(request, { params }) {
  try {
    const reportId = params.id;
    
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

    // Get the form data with the file
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get the report
    const reportRef = crimeReportDoc(db, reportId);
    const reportSnapshot = await getDoc(reportRef);
    
    if (!reportSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }
    
    const reportData = reportSnapshot.data();
    
    // Verify ownership of report
    if (reportData.reporterId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this report' },
        { status: 403 }
      );
    }
    
    // Check if report is in an updatable state
    if (reportData.status !== 'new' && reportData.status !== 'in_review') {
      return NextResponse.json(
        { success: false, error: 'Cannot add media to this report at this stage' },
        { status: 400 }
      );
    }
    
    // Create a file name with timestamp to avoid collisions
    const timestamp = Date.now();
    const fileName = `${reportId}_${timestamp}_${file.name}`;
    
    // Convert file to ArrayBuffer for Firebase Storage
    const bytes = await file.arrayBuffer();
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `reports/${reportId}/${fileName}`);
    await uploadBytes(storageRef, bytes);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update the report with the new media URL
    await updateDoc(reportRef, {
      mediaUrls: arrayUnion(downloadURL)
    });
    
    return NextResponse.json({
      success: true,
      mediaUrl: downloadURL,
      message: 'Media uploaded successfully'
    });
  } catch (error) {
    console.error('Upload media error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload media' },
      { status: 500 }
    );
  }
}