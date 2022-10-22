import { PageConfig } from 'next';
import React, { ReactNode } from 'react';
import { MATCHES, LineupMatch, Contestant, Match } from '../../firebase/schema';
import styles from './BracketRound.module.css';

type Props = {
  winner?: Contestant,
}

const WinnerPopup = (props: Props) => {

  if (!props.winner) return null;

  return (
    <div className={styles.winnerPopup}>
      <div>
        <img className={styles['spin']} src="/images/spinner.svg" />

        <div className={styles['pfp']}>
          <img src={props.winner.image} />
        </div>
        
        <h2>{props.winner.name}</h2>
        <h3>IS THE 2022 <span>COMMANDER-IN-GRIFT</span></h3>
      </div>
    </div>
  )
}

export default WinnerPopup;