
import React, { ReactNode } from 'react';
import styles from './NominationModal.module.css'
import ReCAPTCHA from "react-google-recaptcha";

type Props = {
  onClose: () => void
}

const NominationModal = (props: Props) => {
  const [name, setName] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const [description, setDescription] = React.useState("");
  const [captchaCode, setCaptchaCode] = React.useState("");
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const onClose = (e) => {
    e.preventDefault();

    if (!loading) {
      props.onClose();
    }
  }

  const onSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);
    setError("");

    try {

      if (name.length == 0) {
        throw "Name must be 1 or more characters"
      }
  
      if (name.length > 256) {
        throw "Name must be less than 256 characters"
      }
  
      if (description.length > 1024) {
        throw "Reason for Nomination must be less than 1024 characters"
      }
  
      if (captchaCode.length == 0) {
        throw "Must complete ReCAPTCHA"
      }


      props.onClose();
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

  return (
    <button className={styles.background} onClick={onClose}>
      <aside className={styles.modal} onClick={(e) => e.stopPropagation()} onScroll={(e) => e.stopPropagation()}>

        <form onSubmit={onSubmit}>
          <h1>NOMINATE FOR GRIFTATHON 2022</h1>

          {(error) ? <p className={styles.errorString}>{error}</p> : null}

          <label>Name*</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Reason for Nomination (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>

          <div className={styles.recaptcha}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={'6LdWj78hAAAAAFDTLzjV7w3v6xl3zOviYo2q_yGo'}
              onChange={onReCAPTCHAChange}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </aside>
    </button>
  );
}

export default NominationModal;