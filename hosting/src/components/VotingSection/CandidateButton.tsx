import React from 'react';
import { Contestant, SITE_MODE } from '../../firebase/schema';
import styles from './VotingSection.module.css';

type Props = {
  twitterVotes: number,
  websiteVotes: number, 
  contestantInfo: Contestant | null,
  percentage: number,
  onClick: () => void
}

const VotingSection = (props: Props) => {

  console.log(props.percentage)

  return (
    <button onClick={props.onClick} className={styles.candidate}>

      <div className={styles['img-container']}>
        <div className={styles['img-content']}>
          <img src={(props.contestantInfo) ? props.contestantInfo.image : "/images/default.jpg"}/>
          <div className={styles['image-overlay']} />
        </div>
      </div>
      

      <div className={styles.shortInfo}>
        <h2>{(props.contestantInfo) ? props.contestantInfo.name : "Unknown"}</h2>
      </div>

      <div className={styles.additionalInfo}>
        <p>{(props.contestantInfo) ? props.contestantInfo.description : ""}</p>
        <ul>
          <li>{props.twitterVotes}<span>Twitter Votes</span></li>
          <li>{props.websiteVotes}<span>Website Votes</span></li>
          <li>{(!Number.isNaN(props.percentage)) ? `${Math.round(props.percentage*100)}%` : '-'}<span>Total Percentage</span></li>
        </ul>
      </div>

    </button>
  );
}

export default VotingSection;