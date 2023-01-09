import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

export const app = initializeApp({
  apiKey: "[FIREBASE_API_KEY]",
  authDomain: "griftathon.firebaseapp.com",
  projectId: "griftathon"
});

export const db = getFirestore(app);
export const functions = getFunctions(app);