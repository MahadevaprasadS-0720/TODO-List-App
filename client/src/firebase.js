import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Active Firebase Configuration (uses env vars with direct project fallbacks)
export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here'
      ? import.meta.env.VITE_FIREBASE_API_KEY
      : 'AIzaSyA19SZy-oeFuWzG6gOYtM1-rkPEl6IeJy0',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN.includes('your_project_id')
      ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      : 'todo-list-app-6eaec.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your_project_id'
      ? import.meta.env.VITE_FIREBASE_PROJECT_ID
      : 'todo-list-app-6eaec',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET.includes('your_project_id')
      ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      : 'todo-list-app-6eaec.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID !== 'your_messaging_sender_id'
      ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
      : '292524992315',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID !== 'your_app_id'
      ? import.meta.env.VITE_FIREBASE_APP_ID
      : '1:292524992315:web:b527e2d568203cc6d5f91e',
};

// Initialize Firebase singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;