import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('crimes');
    
    if (req.method === 'GET') {
      // Get a single crime by ID
      const crime = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!crime) {
        return res.status(404).json({ success: false, error: 'Crime report not found' });
      }
      
      return res.status(200).json({ success: true, data: crime });
      
    } else if (req.method === 'PUT') {
      // Update crime status or other details (for admin or verification purposes)
      // This would typically require authentication/authorization
      
      const { status, verified } = req.body;
      
      const updateData = {};
      if (status) updateData.status = status;
      if (verified !== undefined) updateData.verified = verified;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, error: 'No valid update fields provided' });
      }
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return res.status(404).json({ success: false, error: 'Crime report not found' });
      }
      
      return res.status(200).json({ success: true, data: result });
      
    } else if (req.method === 'DELETE') {
      // Delete a crime report (for admin purposes)
      // This would typically require authentication/authorization
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Crime report not found' });
      }
      
      return res.status(200).json({ success: true, message: 'Crime report deleted successfully' });
      
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error(`Error with crime ${req.method} operation:`, error);
    return res.status(500).json({ success: false, error: `Failed to ${req.method.toLowerCase()} crime data` });
  }
}