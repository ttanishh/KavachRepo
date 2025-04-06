import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const mediaId = params.id;
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const mediaCollection = db.collection('media');
    
    // Retrieve the media by ID
    const media = await mediaCollection.findOne({ _id: mediaId });
    
    if (!media) {
      return new NextResponse('Media not found', { status: 404 });
    }
    
    // Create a buffer from the binary data
    const buffer = media.data;
    
    // Create a response with the correct content type
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', media.contentType);
    response.headers.set('Content-Disposition', `inline; filename="${media.filename}"`);
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return response;
    
  } catch (error) {
    console.error('Error retrieving media:', error);
    return new NextResponse('Failed to retrieve media', { status: 500 });
  }
}