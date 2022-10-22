import * as functions from "firebase-functions";
import nominateCandidate from "./functions/nominateCandidate";
import switchMatch from "./functions/switchMatch";
import vote from "./functions/vote";

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
  vote:              functions.https
                      .onCall(vote),
  switchMatch:       functions.pubsub
                      .schedule('*/10 * * * *')
                      .timeZone('America/New_York')
                      .onRun(switchMatch),
}

module.exports = cloudFunctions;