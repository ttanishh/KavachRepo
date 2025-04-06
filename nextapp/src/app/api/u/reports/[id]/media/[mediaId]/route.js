import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { verifyToken } from '@/lib/jwt';
import { ref, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, arrayRemove } from '@/lib/firebase';
import { crimeReportDoc } from '@/models/CrimeReport';

export async function DELETE(request, { params }) {
  try {
    const { id: reportId, mediaId } = params;
    
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
        { success: false, error: 'Cannot modify media for this report at this stage' },
        { status: 400 }
      );
    }
    
    // Find the media URL
    const mediaUrl = reportData.mediaUrls.find(url => url.includes(mediaId));
    
    if (!mediaUrl) {
      return NextResponse.json(
        { success: false, error: 'Media not found in this report' },
        { status: 404 }
      );
    }
    
    // Delete from Firebase Storage if possible
    try {
      const storageRef = ref(storage, mediaUrl);
      await deleteObject(storageRef);
    } catch (storageError) {
      console.warn('Could not delete from storage:', storageError);
      // Continue anyway to remove from report
    }
    
    // Remove the URL from the report
    await updateDoc(reportRef, {
      mediaUrls: arrayRemove(mediaUrl)
    });
    
    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete media' },
      { status: 500 }
    );
  }
}