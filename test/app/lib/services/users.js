import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { User } from '@/models/User';
import { Admin } from '@/models/Admin';
import { SuperAdmin } from '@/models/SuperAdmin';

// Collection references with converters
const usersCollection = collection(db, 'users').withConverter(User.converter);
const adminsCollection = collection(db, 'admins').withConverter(Admin.converter);
const superAdminsCollection = collection(db, 'superAdmins').withConverter(SuperAdmin.converter);

export const usersService = {
  // Create a new user
  async createUser(userData) {
    try {
      const userRef = doc(usersCollection, userData.uid);
      await setDoc(userRef, new User(
        userData.uid,
        userData.fullName,
        userData.email,
        userData.phone,
        userData.role,
        userData.createdAt,
        userData.updatedAt,
        userData.photoURL,
        userData.address
      ));
      
      return { ...userData, id: userData.uid };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Get user by ID
  async getUserById(uid) {
    try {
      // Check in users collection
      const userRef = doc(usersCollection, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { ...userDoc.data(), uid: userDoc.id };
      }
      
      // Check in admins collection
      const adminRef = doc(adminsCollection, uid);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        return { ...adminDoc.data(), uid: adminDoc.id };
      }
      
      // Check in superAdmins collection
      const superAdminRef = doc(superAdminsCollection, uid);
      const superAdminDoc = await getDoc(superAdminRef);
      
      if (superAdminDoc.exists()) {
        return { ...superAdminDoc.data(), uid: superAdminDoc.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },
  
  // Get user by email
  async getUserByEmail(email) {
    try {
      // Check in users collection
      const userQuery = query(usersCollection, where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        return { ...userDoc.data(), uid: userDoc.id };
      }
      
      // Check in admins collection
      const adminQuery = query(adminsCollection, where('email', '==', email));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (!adminSnapshot.empty) {
        const adminDoc = adminSnapshot.docs[0];
        return { ...adminDoc.data(), uid: adminDoc.id };
      }
      
      // Check in superAdmins collection
      const superAdminQuery = query(superAdminsCollection, where('email', '==', email));
      const superAdminSnapshot = await getDocs(superAdminQuery);
      
      if (!superAdminSnapshot.empty) {
        const superAdminDoc = superAdminSnapshot.docs[0];
        return { ...superAdminDoc.data(), uid: superAdminDoc.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },
  
  // Get admin by user ID
  async getAdminByUserId(uid) {
    try {
      const adminRef = doc(adminsCollection, uid);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        return { ...adminDoc.data(), uid: adminDoc.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin by user ID:', error);
      throw error;
    }
  },
  
  // Update user
  async updateUser(uid, userData) {
    try {
      // First, determine which collection the user belongs to
      const user = await this.getUserById(uid);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      let docRef;
      
      if (user.role === 'admin') {
        docRef = doc(adminsCollection, uid);
      } else if (user.role === 'superadmin') {
        docRef = doc(superAdminsCollection, uid);
      } else {
        docRef = doc(usersCollection, uid);
      }
      
      await updateDoc(docRef, userData);
      
      // Get the updated user
      const updatedUser = await this.getUserById(uid);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Create admin user
  async createAdmin(adminData) {
    try {
      const adminRef = doc(adminsCollection, adminData.uid);
      await setDoc(adminRef, new Admin(
        adminData.uid,
        adminData.fullName,
        adminData.email,
        adminData.phone,
        adminData.stationId,
        'admin',
        adminData.createdAt,
        adminData.updatedAt,
        adminData.photoURL,
        adminData.isActive
      ));
      
      return { ...adminData, uid: adminData.uid };
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },
  
  // Create super admin user
  async createSuperAdmin(superAdminData) {
    try {
      const superAdminRef = doc(superAdminsCollection, superAdminData.uid);
      await setDoc(superAdminRef, new SuperAdmin(
        superAdminData.uid,
        superAdminData.fullName,
        superAdminData.email,
        superAdminData.phone,
        'superadmin',
        superAdminData.createdAt,
        superAdminData.updatedAt,
        superAdminData.photoURL
      ));
      
      return { ...superAdminData, uid: superAdminData.uid };
    } catch (error) {
      console.error('Error creating super admin:', error);
      throw error;
    }
  },
  
  // Get admins by station
  async getAdminsByStation(stationId) {
    try {
      const adminQuery = query(adminsCollection, where('stationId', '==', stationId));
      const adminSnapshot = await getDocs(adminQuery);
      
      return adminSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
    } catch (error) {
      console.error('Error getting admins by station:', error);
      throw error;
    }
  }
};
