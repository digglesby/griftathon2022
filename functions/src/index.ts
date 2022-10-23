import * as functions from "firebase-functions";
import checkTwitterPoll from "./functions/checkTwitterPoll";
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
  switchMatch:       functions
                      .runWith({
                        memory: '4GB',
                        timeoutSeconds: 540
                      }).pubsub
                      .schedule('*/10 * * * *')
                      .timeZone('America/New_York')
                      .onRun(switchMatch),
  checkTwitterPoll:  functions.pubsub
                      .schedule('*/2 * * * *')
                      .timeZone('America/New_York')
                      .onRun(checkTwitterPoll),
}

module.exports = cloudFunctions;