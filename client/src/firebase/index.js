// Index re-export to handle directory-level imports like './firebase' or '../firebase'
import app, { db, auth, googleProvider, firebaseConfig } from '../firebase';

export { app, db, auth, googleProvider, firebaseConfig };
export default app;
