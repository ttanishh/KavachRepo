import { NextResponse } from 'next/server';
import { db, collection, getDocs, query, orderBy, limit } from '@/lib/firebase';
import { crimeReports } from '@/models/CrimeReport';

export async function GET() {
  try {
    // Get reports collection
    const reportsRef = crimeReports(db);
    const reportsQuery = query(reportsRef, orderBy('reportedAt', 'desc'), limit(10));
    
    const snapshot = await getDocs(reportsQuery);
    
    // Convert to array of data
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Return success response
    return NextResponse.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch reports'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // For now, just echo the data back
    return NextResponse.json({
      success: true,
      message: 'Report received (mock implementation)',
      data
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create report'
    }, { status: 500 });
  }
}