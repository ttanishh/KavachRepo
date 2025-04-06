import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    // In App Router, we need to use the Web API FormData
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, GIF images and MP4 videos are allowed.' },
        { status: 400 }
      );
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size should not exceed 5MB.' },
        { status: 400 }
      );
    }
    
    // Create unique ID for the media
    const mediaId = uuidv4();
    
    // Get file data as array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const mediaCollection = db.collection('media');
    
    // Store the file in MongoDB
    await mediaCollection.insertOne({
      _id: mediaId,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      uploadDate: new Date(),
      data: buffer,
    });
    
    // Create a URL for accessing this media
    // We'll create a separate API route to retrieve the media
    const mediaUrl = `/api/media/${mediaId}`;
    
    // Return success response with the media URL
    return NextResponse.json({
      success: true,
      url: mediaUrl,
      mediaId: mediaId
    });
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}