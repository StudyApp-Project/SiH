/**
 * Firebase Configuration & Initialization
 * 
 * Project: EduWrap (eduwrap7)
 * Console: https://console.firebase.google.com/project/eduwrap7
 * 
 * Services enabled:
 *   - Authentication (Email/Password + Google)
 *   - Firestore Database
 *   - Storage
 *   - Analytics
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD7c3mI3Z0lNbiOr_CyYh1kJ8b30jijlIk",
  authDomain: "eduwrap7.firebaseapp.com",
  projectId: "eduwrap7",
  storageBucket: "eduwrap7.firebasestorage.app",
  messagingSenderId: "448214726693",
  appId: "1:448214726693:web:4f9e25c80acb56c1a8a7cc",
  measurementId: "G-06Y0DEXHBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Uncomment these lines if you want to use Firebase Emulators for local development:
// connectFirestoreEmulator(db, 'localhost', 8080);
// connectAuthEmulator(auth, 'http://localhost:9099');
// connectStorageEmulator(storage, 'localhost', 9199);

export default app;
