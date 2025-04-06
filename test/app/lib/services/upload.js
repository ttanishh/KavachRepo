import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadService = {
  // Upload file to Firebase Storage
  async uploadFile(file, folder = 'uploads') {
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(storage, filePath);
      
      // Get file buffer
      const buffer = await file.arrayBuffer();
      
      // Upload file
      await uploadBytes(storageRef, buffer, {
        contentType: file.type
      });
      
      // Get download URL
      const url = await getDownloadURL(storageRef);
      
      return {
        id: uuidv4(),
        filename: file.name,
        type: file.type,
        size: file.size,
        url,
        path: filePath,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  // Delete file from Firebase Storage
  async deleteFile(filePath) {
    try {
      if (!filePath) {
        throw new Error('File path is required');
      }
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
