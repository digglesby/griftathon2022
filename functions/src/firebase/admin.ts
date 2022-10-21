import 'firebase-functions';
import * as admin from 'firebase-admin';

//Quick and dirty hack to get around .env files 
//not being loaded on storage cloud functions
const projectName = (process.env["FIREBASE_PROJ"]) ? process.env["FIREBASE_PROJ"] : 'prox-b75e7';

const app = admin.initializeApp({
  projectId: projectName,
  storageBucket: `${projectName}.appspot.com`
},"Cloud Functions");

export const db: admin.firestore.Firestore = admin.firestore(app);
export const storage: admin.storage.Storage = admin.storage(app);
