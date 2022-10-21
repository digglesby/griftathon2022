
import { httpsCallable } from 'firebase/functions';
import {functions} from '../app';

const nominateCandidate = httpsCallable(functions, 'nominateCandidate');

interface FunctionInput {
  uid: string,
  name: string,
  description: string,
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
    response = (await nominateCandidate(params)).data as FunctionOutput;
  } catch (err) {
    console.error(err);
    throw "Sever error, please try again later!";
  }

  if (response.success === false) {
    throw response.error;
  }
}