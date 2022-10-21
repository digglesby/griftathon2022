import React from 'react';
import { Contestant, SITE_MODE } from '../../firebase/schema';
import styles from './VotingSection.module.css';

type Props = {
  twitterVotes: number,
  websiteVotes: number, 
  contestantInfo: Contestant,
  percentage: number,
  contestantKey: string,
  onClick: () => void
}

const VotingSection = (props: Props) => {

  if (props.contestantInfo === undefined) {
    console.error(`UNABLE TO FIND KEY: ${props.contestantKey}`)
  }

  return (
    <button onClick={props.onClick} className={styles.candidate}>

      <div className={styles['img-container']}>
        <div className={styles['img-content']}>
          <img src={props.contestantInfo.image}/>
          <div className={styles['image-overlay']} />
        </div>
      </div>
      

      <div className={styles.shortInfo}>
        <h2>{props.contestantInfo.name}</h2>
      </div>

      <div className={styles.additionalInfo}>
        <p>{props.contestantInfo.description}</p>
        <ul>
          <li>{props.twitterVotes}<span>Twitter Votes</span></li>
          <li>{props.websiteVotes}<span>Website Votes</span></li>
          <li>{Math.round(props.percentage*100)}%<span>Total Percentage</span></li>
        </ul>
      </div>

    </button>
  );
}

export default VotingSection;