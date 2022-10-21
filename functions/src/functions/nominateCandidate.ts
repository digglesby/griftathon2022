import { db } from '../firebase/admin';
import { logger } from 'firebase-functions/v1';
import * as functions from "firebase-functions";
import { Group } from '../firebase/schema';
import { GeoPoint } from 'firebase-admin/firestore';
import { Validator } from 'node-input-validator';
import testCaptcha from '../utils/testCaptcha';

/**
 * nominateCandidate
 * 
 * Adds a candidate to the nomination table
 */

type Input = {
  uid: string,
  name: string,
  description: string,
  captcha: string
}

const InputValidationRules = {
  'uid': 'string|required',
  'name': 'string|required|lengthBetween:0,64',
  'description': 'string|lengthBetween:0,2048',
  'captcha': 'string'
};

async function nominateCandidate(input: any, context: functions.https.CallableContext) {

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

  try {
    
    const nomRef = db.collection("nominations").doc();
      
    await nomRef.set({
      uid: data.uid,
      name: data.name,
      description: data.description,
      ip: ip
    });

  } catch (err) {

    logger.error(`Failed to insert buddy group object\n${err}`);

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

export default nominateCandidate;