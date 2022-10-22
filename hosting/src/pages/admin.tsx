import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { useState } from "react";
import { json } from "stream/consumers";
import { app } from "../firebase/app";

const auth = getAuth(app);
const provider = new TwitterAuthProvider();

type Props = {}

const Admin = (props: Props) => {
  
  const [tokenData, setTokenData] = useState<any>();

  if (process && process.env.NODE_ENV !== 'development') return null;

  const redirectSignin = async () => {
    try {
      const results = await signInWithPopup(auth, provider);

      const providerResult = TwitterAuthProvider.credentialFromResult(results);

      setTokenData(providerResult);

    } catch (err) {

    }
  }

  return (
    <div>
      <button onClick={redirectSignin}>Sign in</button>
      <p>{JSON.stringify(tokenData)}</p>
    </div>
  )

}


export default Admin