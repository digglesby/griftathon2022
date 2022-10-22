import React from 'react';
import { Match, SiteConfig, SITE_MODE } from '../../firebase/schema';
import styles from './VotingSection.module.css';
import CandidateButton from './CandidateButton';
import Countdown from './Countdown';

type Props = {
  siteConfig: SiteConfig,
  currentMatch?: Match,
  setCandidate: (candidate: string) => void
}

const VotingSection = (props: Props) => {

  if (props.siteConfig.mode != SITE_MODE.VOTING) return null;

  let totalVotes = 0;
  let contestant1Votes = 0;

  if (props.currentMatch){
    totalVotes = props.currentMatch.contestant1TwitterVotes + props.currentMatch.contestant1WebsiteVotes + props.currentMatch.contestant2TwitterVotes + props.currentMatch.contestant2WebsiteVotes;
    contestant1Votes = props.currentMatch.contestant1TwitterVotes + props.currentMatch.contestant1WebsiteVotes;
  }

  return (
    <div className={styles.votingSection}>
      <div className={styles.resultsBar}>
        <div className={styles.resultsBarContainer}>
          <div className={styles.bar1}>
            <h4>{ (totalVotes == 0) ? "-" : `${Math.round((contestant1Votes/totalVotes)*100)}%` }</h4>
          </div>
          <div className={styles.bar2} style={{width: (totalVotes == 0) ? `50%` : `${(1-(contestant1Votes/totalVotes))*100}%`}}>
            <h4>{ (totalVotes == 0) ? "-" : `${Math.round((1-(contestant1Votes/totalVotes))*100)}%` }</h4>
          </div>
        </div>
        
      </div>
      <div className={styles.candidates}>
        <CandidateButton
          twitterVotes={(props.currentMatch) ? props.currentMatch.contestant1TwitterVotes : 0}
          websiteVotes={(props.currentMatch) ? props.currentMatch.contestant1WebsiteVotes : 0}
          contestantInfo={(props.currentMatch) ? props.siteConfig.contestants[props.currentMatch.contestant1] : null}
          percentage={contestant1Votes/totalVotes}
          onClick={() => { if (props.currentMatch) { props.setCandidate(props.currentMatch.contestant1)} } }
        />
        <CandidateButton
          twitterVotes={(props.currentMatch) ? props.currentMatch.contestant2TwitterVotes : 0}
          websiteVotes={(props.currentMatch) ? props.currentMatch.contestant2WebsiteVotes : 0}
          contestantInfo={(props.currentMatch) ? props.siteConfig.contestants[props.currentMatch.contestant2] : null}
          percentage={(totalVotes - contestant1Votes)/totalVotes}
          onClick={() => { if (props.currentMatch) { props.setCandidate(props.currentMatch.contestant2)} } }
        />
        <Countdown until={props.siteConfig.voting_ends} />
      </div>
    </div>
  );
}

export default VotingSection;