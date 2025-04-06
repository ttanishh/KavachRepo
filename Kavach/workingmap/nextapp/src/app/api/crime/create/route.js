import { connectToDatabase } from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { type, description, media, location } = body;
    
    // Validate required fields
    if (!type || !description || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const collection = db.collection('crimes');
    
    // Use anonymous user data for now - you can add auth later
    const userData = {
      userId: 'anonymous',
      name: 'Anonymous User'
    };
    
    const newCrime = {
      type,
      description,
      media: media || null,
      location,
      timestamp: new Date(),
      reportedBy: userData,
      status: 'reported', // Initial status
      verified: false
    };
    
    const result = await collection.insertOne(newCrime);
    
    // Get the inserted document
    const insertedCrime = await collection.findOne({ _id: result.insertedId });
    
    // Emit real-time update if webhook URL is configured
    if (process.env.SOCKET_WEBHOOK_URL) {
      try {
        await fetch(process.env.SOCKET_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SOCKET_SECRET_KEY || ''}`
          },
          body: JSON.stringify({
            event: 'new-crime-report',
            data: insertedCrime
          })
        });
      } catch (webhookError) {
        console.error('Failed to send webhook:', webhookError);
        // Continue anyway as this is non-critical
      }
    }
    
    return NextResponse.json(
      { success: true, data: insertedCrime },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating crime report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create crime report' },
      { status: 500 }
    );
  }
}