import * as functions from "firebase-functions";
import nominateCandidate from "./functions/nominateCandidate";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const cloudFunctions = {
  nominateCandidate: functions.https
                      .onCall(nominateCandidate),
}

module.exports = cloudFunctions;