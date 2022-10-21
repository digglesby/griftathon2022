import React from 'react';
import { Match, SiteConfig, SITE_MODE } from '../../firebase/schema';
import styles from './VotingSection.module.css';
import CandidateButton from './CandidateButton';

type Props = {
  siteConfig: SiteConfig,
  currentMatch: Match,
  setCandidate: (candidate: string) => void
}

const VotingSection = (props: Props) => {

  if (props.siteConfig.mode != SITE_MODE.VOTING) return null;

  const totalVotes = props.currentMatch.contestant1TwitterVotes + props.currentMatch.contestant1WebsiteVotes + props.currentMatch.contestant2TwitterVotes + props.currentMatch.contestant2WebsiteVotes;
  const contestant1Votes = props.currentMatch.contestant1TwitterVotes + props.currentMatch.contestant1WebsiteVotes;

  return (
    <div className={styles.votingSection}>
      <div className={styles.resultsBar}>
        <div className={styles.resultsBarContainer}>
          <div className={styles.bar1}>
            <h4>{ Math.round((contestant1Votes/totalVotes)*100) }%</h4>
          </div>
          <div className={styles.bar2} style={{width: `${(1-(contestant1Votes/totalVotes))*100}%`}}>
            <h4>{ Math.round((1-(contestant1Votes/totalVotes))*100) }%</h4>
          </div>
        </div>
        
      </div>
      <div className={styles.candidates}>
        <CandidateButton
          twitterVotes={props.currentMatch.contestant1TwitterVotes}
          websiteVotes={props.currentMatch.contestant1WebsiteVotes}
          contestantInfo={props.siteConfig.contestants[props.currentMatch.contestant1]}
          contestantKey={props.currentMatch.contestant1}
          percentage={contestant1Votes/totalVotes}
          onClick={() => {props.setCandidate(props.currentMatch.contestant1)}}
        />
        <CandidateButton
          twitterVotes={props.currentMatch.contestant2TwitterVotes}
          websiteVotes={props.currentMatch.contestant2WebsiteVotes}
          contestantInfo={props.siteConfig.contestants[props.currentMatch.contestant2]}
          contestantKey={props.currentMatch.contestant2}
          percentage={(totalVotes - contestant1Votes)/totalVotes}
          onClick={() => {props.setCandidate(props.currentMatch.contestant2)}}
        />
      </div>
    </div>
  );
}

export default VotingSection;