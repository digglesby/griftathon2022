
import { httpsCallable } from 'firebase/functions';
import {functions} from '../app';

const vote = httpsCallable(functions, 'vote');

interface FunctionInput {
  uid: string,
  candidate: string,
  captcha: string
}

interface FunctionOutput {
  success: boolean,
  data?: {},
  error?: string,
  errorCode?: number
}

export default async function(params: FunctionInput) {
  let response: FunctionOutput;

  try {
    response = (await vote(params)).data as FunctionOutput;
  } catch (err) {
    console.error(err);
    throw "Sever error, please try again later!";
  }

  if (response.success === false) {
    throw response.error;
  }
}