import React, { ReactNode } from 'react';
import { Match, MATCHES,SiteConfig, SITE_MODE } from '../../firebase/schema';
import BracketRound from './BracketRound';
import styles from './BracketTree.module.css';
import WinnerPopup from './WinnerPopup';

type Props = {
  siteConfig: SiteConfig,
  currentMatch?: Match,
  setCandidate: (candidate: string) => void
}

const BracketConnection = (props: { mode: 'bracketLeft' | 'bracketRight' | 'finalLine' }) => {

  if (props.mode == 'finalLine'){
    return (
      <div className={styles[props.mode]}>
        <div>
          <div className={styles.line}></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles[props.mode]}>
        <div>
          <div className={styles.fakeBox}></div>
          <div className={styles.line}></div>
        </div>
      </div>
    )
  }
}

const BracketTree = (props: Props) => {

  if ((props.siteConfig.mode != SITE_MODE.VOTING) && (props.siteConfig.mode != SITE_MODE.WINNER)) return null;

  const lineup = props.siteConfig.lineup;
  const currentRound = (props.siteConfig.mode == SITE_MODE.VOTING) ? props.siteConfig.current_match : null;
  const contestants = props.siteConfig.contestants;

  const matchKeys = Object.keys(MATCHES);
  let matchComponents: {[key: string]: ReactNode} = {};

  matchKeys.forEach((match) => {
    const contestant1 = lineup[match].contestant1;
    const contestant2 = lineup[match].contestant2;
    let winner;

    if (lineup[match].results){
      if (lineup[match].results.winner == contestant1) {
        winner = 1;
      } else {
        winner = 2;
      }
    }

    matchComponents[match] = (
      <BracketRound
        key={match}
        matchData={lineup[match]}
        matchId={MATCHES[match]}
        isCurrentMatch={MATCHES[match] == currentRound}
        currentMatch={(MATCHES[match] == currentRound) ? props.currentMatch: undefined}
        contestant1={(contestant1 != undefined) ? contestants[contestant1]: undefined}
        contestant2={(contestant2 != undefined) ? contestants[contestant2]: undefined}
        winner={winner}
        setCandidate={props.setCandidate}
      />
    );
  })

  return (
    <main className={styles.bracketTree}>

      <article id="FIRST_ROUNDS_1">
        <header>
          <h2>FIRST ROUND</h2>
        </header>
        <div>
          {matchComponents[MATCHES.FIRST_ROUND_1]}
          {matchComponents[MATCHES.FIRST_ROUND_2]}
          {matchComponents[MATCHES.FIRST_ROUND_3]}
          {matchComponents[MATCHES.FIRST_ROUND_4]}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='bracketLeft'/>
        <BracketConnection mode='bracketLeft'/>
      </div>

      <article id="QUARTERFINALS_1">
        <header>
          <h2>QUARTERFINALS</h2>
        </header>
        <div>
          {matchComponents[MATCHES.QUARTERFINALS_1]}
          {matchComponents[MATCHES.QUARTERFINALS_2]}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='bracketLeft'/>
      </div>

      <article id="SEMIFINALS_1">
        <header>
          <h2>SEMIFINALS</h2>
        </header>
        <div>
          {matchComponents[MATCHES.SEMIFINALS_1]}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='finalLine'/>
      </div>

      <article id="FINALS">
        <header>
          <h2>FINALS</h2>
        </header>
        <div>
          {matchComponents[MATCHES.FINALS]}
          {(props.siteConfig.mode == SITE_MODE.WINNER) ? <WinnerPopup winner={props.siteConfig.contestants[props.siteConfig.winner]} /> : null}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='finalLine'/>
      </div>

      <article id="SEMIFINALS_2">
        <header>
          <h2>SEMIFINALS</h2>
        </header>
        <div>
          {matchComponents[MATCHES.SEMIFINALS_2]}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='bracketRight'/>
      </div>

      <article id="QUARTERFINALS_2">
        <header>
          <h2>QUARTERFINALS</h2>
        </header>
        <div>
          {matchComponents[MATCHES.QUARTERFINALS_3]}
          {matchComponents[MATCHES.QUARTERFINALS_4]}
        </div>
      </article>

      <div className={styles.connections}>
        <header />
        <BracketConnection mode='bracketRight'/>
        <BracketConnection mode='bracketRight'/>
      </div>

      <article id="FIRST_ROUNDS_2">
        <header>
          <h2>FIRST ROUND</h2>
        </header>
        <div>
          {matchComponents[MATCHES.FIRST_ROUND_5]}
          {matchComponents[MATCHES.FIRST_ROUND_6]}
          {matchComponents[MATCHES.FIRST_ROUND_7]}
          {matchComponents[MATCHES.FIRST_ROUND_8]}
        </div>
      </article>
    </main>
  );
}

export default BracketTree;