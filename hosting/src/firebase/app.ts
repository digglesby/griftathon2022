import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

export const app = initializeApp({
  apiKey: "AIzaSyA6w7M9dyT_56ixjArRMo_k8UoRM1Gif-s",
  authDomain: "griftathon.firebaseapp.com",
  projectId: "griftathon"
});

export const db = getFirestore(app);
export const functions = getFunctions(app);