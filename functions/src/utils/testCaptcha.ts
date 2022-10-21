

export default async function testCaptcha(captcha: string): Promise<void> {

  const fetch = require('node-fetch');

  // Ping the google recaptcha verify API to verify the captcha code you received
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      method: "POST",
    }
  );
  const captchaValidation: any = await response.json();

  /**
   * The structure of response from the veirfy API is
   * {
   *  "success": true|false,
   *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
   *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
   *  "error-codes": [...]        // optional
    }
    */

  if (!captchaValidation.success) {
    // Replace this with the API that will save the data received
    // to your backend

    throw new Error(captchaValidation)
  }

}