import { PageConfig } from 'next';
import React, { ReactNode } from 'react';
import { MATCHES, LineupMatch, Contestant, Match } from '../../firebase/schema';
import styles from './BracketRound.module.css';

type Props = {
  matchData: LineupMatch,
  matchId: MATCHES,
  isCurrentMatch: boolean,
  currentMatch?: Match,
  contestant1?: Contestant,
  contestant2?: Contestant,
  winner?: number,
  setCandidate: (candidate: string) => void
}

type ContestantObjProps = {
  isCurrentMatch: boolean,
  isWinner: boolean,
  contestantId?: string,
  data?: Contestant,
  percentage?: number,
  setCandidate: (candidate: string) => void
}

const ContestantObj = (props: ContestantObjProps) => {

  let className = styles.default;

  if (!props.isCurrentMatch){
    if (props.isWinner) {
      className = styles.winner;
    } else if (props.percentage !== undefined) {
      className = styles.loser;
    }
  } else {
    className = styles.current;
  }

  return (props.isCurrentMatch) ? (
    <button className={`${styles.contestant} ${className}`} onClick={()=>{props.setCandidate(props.contestantId)}}>
      <img src={(props.data) ? props.data.image : "/images/default.jpg"} />
      <h2>{(props.data) ? props.data.name : "Unknown"}</h2>
      <p><span>{(props.percentage) ? `${Math.round(props.percentage*100)}%` : '-'}</span></p>
    </button>
  ) : (
    <div className={`${styles.contestant} ${className}`}>
      <img src={(props.data) ? props.data.image : "/images/default.jpg"} />
      <h2>{(props.data) ? props.data.name : "Unknown"}</h2>
      <p><span>{(props.percentage) ? `${Math.round(props.percentage*100)}%` : '-'}</span></p>
    </div>
  )
}

const BracketRound = (props: Props) => {

  const hasLine2 = [
    MATCHES.QUARTERFINALS_1,
    MATCHES.QUARTERFINALS_2,
    MATCHES.QUARTERFINALS_3,
    MATCHES.QUARTERFINALS_4,
    MATCHES.SEMIFINALS_1,
    MATCHES.SEMIFINALS_2,
    MATCHES.FINALS
  ]

  const isRight = [
    MATCHES.FIRST_ROUND_5,
    MATCHES.FIRST_ROUND_6,
    MATCHES.FIRST_ROUND_7,
    MATCHES.FIRST_ROUND_8,
    MATCHES.QUARTERFINALS_3,
    MATCHES.QUARTERFINALS_4,
    MATCHES.SEMIFINALS_2,
  ]

  let contestant1Percentage;
  let contestant2Percentage;

  if (props.matchData.results) {
    const loserVotes =  props.matchData.results.loserTwitterVotes + 
                        props.matchData.results.loserWebVotes;
    const winnerVotes = props.matchData.results.winnerTwitterVotes +
                        props.matchData.results.winnerWebVotes;

    if (props.winner == 1) {
      contestant1Percentage = winnerVotes / (winnerVotes + loserVotes)
      contestant2Percentage = loserVotes / (winnerVotes + loserVotes)
    } else {
      contestant1Percentage = loserVotes / (winnerVotes + loserVotes)
      contestant2Percentage = winnerVotes / (winnerVotes + loserVotes)
    }
  } else if (props.currentMatch) {

    const contestant1Votes =  props.currentMatch.contestant1TwitterVotes + 
                              props.currentMatch.contestant1WebsiteVotes;
    const contestant2Votes =  props.currentMatch.contestant2TwitterVotes +
                              props.currentMatch.contestant2WebsiteVotes;

    contestant1Percentage = contestant1Votes / (contestant1Votes + contestant2Votes)
    contestant2Percentage = contestant2Votes / (contestant1Votes + contestant2Votes)
  }


  return (
    <div className={`${styles.bracketRound} ${(props.matchId == MATCHES.FINALS) ? styles.finalRound : ""} ${(isRight.indexOf(props.matchId) != -1) ? styles.rightSide : ""}`}>
      <div>
        <article className={`${(props.isCurrentMatch) ? styles.current : ""}`}>
          <ContestantObj 
            isCurrentMatch={props.isCurrentMatch}
            isWinner={props.winner == 1}
            data={props.contestant1}
            percentage={contestant1Percentage}
            setCandidate={props.setCandidate}
            contestantId={props.matchData.contestant1}
          />
          <ContestantObj 
            isCurrentMatch={props.isCurrentMatch}
            isWinner={props.winner == 2}
            data={props.contestant2}
            percentage={contestant2Percentage}
            setCandidate={props.setCandidate}
            contestantId={props.matchData.contestant2}
          />
        </article>
      </div>
    </div>
  );
}

export default BracketRound;