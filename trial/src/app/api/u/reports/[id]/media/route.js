import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/services/auth';
import { reportsService } from '@/lib/services/reports';
import { uploadService } from '@/lib/services/upload';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Upload media for a report
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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - user must own the report
    if (report.reporterId !== decoded.uid) {
      return NextResponse.json(
        { message: 'You are not authorized to add media to this report' },
        { status: 403 }
      );
    }
    
    // Parse form data for files
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: 'No files uploaded' },
        { status: 400 }
      );
    }
    
    // Upload each file
    const uploadPromises = files.map(file => 
      uploadService.uploadFile(file, `reports/${id}`)
    );
    
    const uploadedFiles = await Promise.all(uploadPromises);
    
    // Save file metadata to report
    const savedMedia = await Promise.all(
      uploadedFiles.map(file => reportsService.addMediaToReport(id, file))
    );
    
    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: savedMedia,
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { message: 'Failed to upload files', error: error.message },
      { status: 500 }
    );
  }
}

// Delete media from a report
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { message: 'Media ID is required' },
        { status: 400 }
      );
    }

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

    // Get report
    const report = await reportsService.getReportById(id);
    
    if (!report) {
      return NextResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - user must own the report
    if (report.reporterId !== decoded.uid) {
      return NextResponse.json(
        { message: 'You are not authorized to delete media from this report' },
        { status: 403 }
      );
    }
    
    // Get media
    const media = await reportsService.getMediaById(id, mediaId);
    
    if (!media) {
      return NextResponse.json(
        { message: 'Media not found' },
        { status: 404 }
      );
    }
    
    // Delete file from storage
    if (media.path) {
      await uploadService.deleteFile(media.path);
    }
    
    // Delete media record
    await reportsService.deleteMedia(id, mediaId);
    
    return NextResponse.json({
      message: 'Media deleted successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { message: 'Failed to delete media', error: error.message },
      { status: 500 }
    );
  }
}
