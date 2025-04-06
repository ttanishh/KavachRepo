import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  GeoPoint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-tL1N9w71u66LgK8KKVJqJ4wGzLU_sJM",
  authDomain: "kavach-58841.firebaseapp.com",
  projectId: "kavach-58841",
  storageBucket: "kavach-58841.firebasestorage.app",
  messagingSenderId: "1001180207294",
  appId: "1:1001180207294:web:0ecc444802f1ec35ce66ef",
  measurementId: "G-7X6G2ELH4P"
};

// Initialize Firebase
let firebaseApp;
let auth;
let db;
let storage;
let analytics;

try {
  // Properly initialize Firebase app
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }

  // Initialize Firebase services
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);

  // Initialize analytics only on client side
  if (typeof window !== 'undefined') {
    // Dynamically import analytics to prevent server-side rendering issues
    import('firebase/analytics').then(({ getAnalytics }) => {
      analytics = getAnalytics(firebaseApp);
    }).catch(error => {
      console.error('Analytics initialization error:', error);
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Enhanced setDoc with error handling
const enhancedSetDoc = async (docRef, data, options) => {
  try {
    // First check if the collection exists, create it if it doesn't
    const collectionPath = docRef.path.split('/').slice(0, -1).join('/');
    if (collectionPath) {
      // This is just a check/validation, not an actual operation
      // Firebase will automatically create collections when documents are added
      console.log(`Ensuring collection exists: ${collectionPath}`);
    }
    
    // Now set the document
    return await setDoc(docRef, data, options);
  } catch (error) {
    console.error(`Error in setDoc operation: ${error.message}`);
    
    // Custom error handling
    if (error.code === 5 || error.message.includes('NOT_FOUND')) {
      console.error('Collection or document path not found');
    }
    
    throw error;
  }
};

export { 
  firebaseApp, 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  db, 
  collection, 
  doc, 
  enhancedSetDoc as setDoc, // Replace regular setDoc with enhanced version
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  GeoPoint,
  Timestamp,
  serverTimestamp
};

// Export analytics for use in tracking components
export const getFirebaseAnalytics = () => analytics;

// For date handling
export const dateToTimestamp = (date) => {
  if (!date) return null;
  return Timestamp.fromDate(new Date(date));
};