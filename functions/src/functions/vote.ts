import { db } from '../firebase/admin';
import { logger } from 'firebase-functions/v1';
import * as functions from "firebase-functions";
import { Validator } from 'node-input-validator';
import testCaptcha from '../utils/testCaptcha';
import { Match, SiteConfig, SITE_MODE } from '../firebase/schema';
import { firestore } from 'firebase-admin';

/**
 * nominateCandidate
 * 
 * Adds a candidate to the nomination table
 */

type Input = {
  uid: string,
  candidate: string,
  captcha: string
}

const InputValidationRules = {
  'uid': 'string|required',
  'candidate': 'string|required',
  'captcha': 'string'
};

async function vote(input: any, context: functions.https.CallableContext) {

  const validator = new Validator(input, InputValidationRules);
  const ip = context.rawRequest.ip;

  //Check input validation
  const validationResult = await validator.check();

  if (!validationResult) {
    return {
      success: false,
      errorCode: 400,
      error: validator.getErrors()[0]
    }
  }

  const data = input as Input;


  //Check captcha
  try {

    await testCaptcha(data.captcha);

  } catch (err) {
    logger.error(`Failed to verify captcha \n${err}`);

    return {
      success: false,
      errorCode: 400,
      error: "Invalid Captcha!"
    }
  }

  //Get current round
  const confRef = db.collection("site_config").doc("current");
  let matchRef;
  let currentSiteConfig: SiteConfig;
  let match: Match;

  try {

    currentSiteConfig = (await confRef.get()).data() as SiteConfig;

    if (currentSiteConfig.mode != SITE_MODE.VOTING) {
      throw new Error("Not currently in voting mode!")
    }

    matchRef = db.collection("matches").doc(currentSiteConfig.current_match);

    match = (await matchRef.get()).data() as Match;

  } catch(err) {

    logger.error(`Failed to find current match \n${err}`);

    return {
      success: false,
      errorCode: 400,
      error: "Unable to find current match!"
    }
  }

  //Silently ignore requests from the same uid
  try {

    const query = db.collection("votes").where("uid","==",data.uid).where("match","==",currentSiteConfig.current_match);
    const query_results = await query.get();

    if (query_results.docs.length > 0) {
      throw new Error("User ablready voted in this round!");
    }

  } catch (err) {

    logger.warn(`Silently ignored request because of UID: \n${err}`);

    return {
      success: true,
      data: {}
    }

  }


  try {

    const voteRef = db.collection("votes").doc();
      
    await voteRef.set({
      uid: data.uid,
      candidate: data.candidate,
      match: currentSiteConfig.current_match,
      ip: ip
    });

    let key = "";

    if (match.contestant1 == data.candidate) {
      key = "contestant1WebsiteVotes";
    } else if (match.contestant2 == data.candidate) {
      key = "contestant2WebsiteVotes";
    } else {
      throw new Error("Invalid candidate!")
    }

    await matchRef.update({ [key]: firestore.FieldValue.increment(1) });

  } catch (err) {

    logger.error(`Failed to insert buddy group object: \n${err}`);

    return {
      success: false,
      errorCode: 500,
      error: "Server error, please try again!"
    }
  }

  return {
    success: true,
    data: {}
  }
}

export default vote;