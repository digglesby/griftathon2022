import React, { useEffect, useState } from 'react';
import styles from './VotingSection.module.css';

type Props = {
  until: number
}

const Countdown = (props: Props) => {
  const [timeUntil, setTimeUntil] = useState( Math.max( 0, props.until - new Date().getTime() ) );

  useEffect(()=>{

    const intervalID = setInterval(()=>{
      setTimeUntil( Math.max( 0, props.until - new Date().getTime() ) )
    }, 1000);

    return ()=>{
      clearInterval(intervalID);
    }

  },[props.until]);

  let time = timeUntil;

  let hours = Math.floor(time / (1000 * 60 * 60));
  time = time - (hours * (1000 * 60 * 60))

  let minutes = Math.floor(time / (1000 * 60));
  time = time - (minutes * (1000 * 60));

  let seconds = Math.floor(time / 1000);

  return (
    <h3 className={styles.countdown}>
      {`${hours}`.padStart(2, '0')}:{`${minutes}`.padStart(2, '0')}:{`${seconds}`.padStart(2, '0')}
    </h3>
  );
}

export default Countdown;