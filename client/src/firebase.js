// Re-export active Firebase instance and Firestore db from configuration
import app, { db } from './firebase/config';

export { app, db };
export default app;