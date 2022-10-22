
import React, { useEffect, useState } from 'react';
import styles from './VotingModal.module.css'
import ReCAPTCHA from "react-google-recaptcha";
import { Match, SiteConfig, SITE_MODE } from '../../firebase/schema';
import getFingerprintHash from '../../helpers/getFingerprintHash';
import vote from '../../firebase/functions/vote';

type Props = {
  onClose: () => void,
  match: Match,
  siteConfig: SiteConfig,
  candidate: string
}

const NominationModal = (props: Props) => {

  if (props.siteConfig.mode !== SITE_MODE.VOTING) return null;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [captchaCode, setCaptchaCode] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [candidate, setCandidate] = React.useState<string>(props.candidate);
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const currentCandidate = props.siteConfig.contestants[candidate];

  useEffect(() => {

    const lastSubmitted = localStorage.getItem('submitted');
    const votedFor = localStorage.getItem('votedFor');

    if ((lastSubmitted) && (lastSubmitted === props.match.match)) {
      setSubmitted(true);
      setCandidate(votedFor);
    }
    
  },[])

  const onClose = (e) => {
    e.preventDefault();

    if (!loading) {
      props.onClose();
    }
  }

  const onSubmit = async (event) => {

    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {

      if (submitted) return;
        
      if (captchaCode.length == 0) {
        throw "Must complete ReCAPTCHA"
      }

      await vote({
        uid: await getFingerprintHash(),
        candidate: candidate,
        captcha: captchaCode
      })

      localStorage.setItem('submitted', props.match.match);
      localStorage.setItem('votedFor', props.candidate);

      setSubmitted(true);
      recaptchaRef.current.reset();

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const onReCAPTCHAChange = (code) => {

    if(!code) {
      return;
    }

    setCaptchaCode(code);
  }

  if (!submitted){
    return (
      <div className={styles.background} onClick={onClose}>
        <aside className={styles.modal} onClick={(e) => e.stopPropagation()} onScroll={(e) => e.stopPropagation()}>

          <form onSubmit={onSubmit}>
            <h1>VOTE FOR {currentCandidate.name}</h1>

            <img src={currentCandidate.image}/>

            <p>{currentCandidate.description}</p>

            {(error) ? <p className={styles.errorString}>{error}</p> : null}

            <div className={styles.recaptcha}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={'6LdWj78hAAAAAFDTLzjV7w3v6xl3zOviYo2q_yGo'}
                onChange={onReCAPTCHAChange}
              />
            </div>

            <button type="submit">{(loading) ? "Loading..." : "Vote"}</button>
          </form>
        </aside>
      </div>
    );
  } else {
    return (
      <div className={styles.background} onClick={onClose}>
        <aside className={styles.modal} onClick={(e) => e.stopPropagation()} onScroll={(e) => e.stopPropagation()}>

          <div>
            <h1>THANKS FOR VOTING IN  GRIFTATHON 2022</h1>

            <p>Your vote for {currentCandidate.name} has been recorded!</p>

            <a 
              className={styles['share-btn']}
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just voted for "+currentCandidate.name+" in #GRIFTATHON2022")}&url=${encodeURIComponent("https://www.griftathon.com/")}`}>
                <img src='/images/twitter.svg' /> Share on Twitter
            </a>

            <button onClick={onClose}>Back</button>
          </div>
        </aside>
      </div>
    );
  }
}

export default NominationModal;