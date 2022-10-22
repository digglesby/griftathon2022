import React from 'react';
import { LineupMatch, MATCHES, SiteConfig, SITE_MODE } from '../../firebase/schema';
import styles from './Candidates.module.css';

type Props = {
  siteConfig: SiteConfig
}

type CandidateProps = {
  image: string,
  name: string,
  description: string,
  eliminated: boolean
}

const getActiveCandidates = (siteConfig: SiteConfig): string[] => {
  if (siteConfig.mode == SITE_MODE.WINNER) return [siteConfig.winner];
  if (siteConfig.mode != SITE_MODE.VOTING) return [];

  let activeCandidates = [...Object.keys(siteConfig.contestants)];

  for (const key in siteConfig.lineup) {
    const match = siteConfig.lineup[MATCHES[key]] as LineupMatch;

    if (match.results) {
      if (activeCandidates.indexOf(match.results.loser) != -1) {
        activeCandidates.splice(activeCandidates.indexOf(match.results.loser), 1)
      }
    }
  }

  return activeCandidates;
}

const Candidate = ( props: CandidateProps) => {

  return (
    <article className={`${styles.candidate} ${(props.eliminated) ? styles.eliminated : ""}`}>
      <div>
        <img src={props.image} />
        <div className={styles.text}>
          <h2>
            {props.name} 
          </h2>
          {(props.eliminated) ? <h3>[ ELIMINATED ]</h3> : null}
        </div>
      </div>
      <p>
        {props.description}
      </p>
    </article>
  )
}

const Candidates = (props: Props) => {

  if ((props.siteConfig.mode != SITE_MODE.VOTING) && (props.siteConfig.mode != SITE_MODE.WINNER)) return null;

  let activeCandidates = getActiveCandidates(props.siteConfig);

  let CandidateObjects = [];

  for (const key in props.siteConfig.contestants) {
    const candidateData = props.siteConfig.contestants[key];

    CandidateObjects.push(
      <Candidate 
        image={candidateData.image}
        description={candidateData.description}
        name={candidateData.name}
        eliminated={(activeCandidates.indexOf(key) == -1)}
      />
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <h1>Meet the Candidates</h1>
        <div>
          {CandidateObjects}
        </div>
      </main>
    </div>
  );
}

export default Candidates;