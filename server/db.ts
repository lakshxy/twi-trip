import 'dotenv/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT must be set in .env file"
  );
}

const firebaseApp = getApps().length === 0 
  ? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    })
  : getApps()[0];

export const db = getFirestore(firebaseApp);

// Optional Firestore settings
db.settings({
  ignoreUndefinedProperties: true
});