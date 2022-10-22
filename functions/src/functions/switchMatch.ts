import { db } from '../firebase/admin';
import * as functions from "firebase-functions";
import { logger } from 'firebase-functions/v1';
import { LineupMatch, Match, MATCHES, SiteConfig, SITE_MODE } from '../firebase/schema';


/**
 * Switch match
 */

async function archiveOldChatRooms(context: functions.EventContext) {

  const currentTime = new Date(context.timestamp);
  //const votingTime = 1000 * 60 * 60 * 24;
  const votingTime = 1000 * 60 * 10;

  const matchOrder = [
    MATCHES.FIRST_ROUND_1,
    MATCHES.FIRST_ROUND_2,
    MATCHES.FIRST_ROUND_3,
    MATCHES.FIRST_ROUND_4,
    MATCHES.FIRST_ROUND_5,
    MATCHES.FIRST_ROUND_6,
    MATCHES.FIRST_ROUND_7,
    MATCHES.FIRST_ROUND_8,
    MATCHES.QUARTERFINALS_1,
    MATCHES.QUARTERFINALS_2,
    MATCHES.QUARTERFINALS_3,
    MATCHES.QUARTERFINALS_4,
    MATCHES.SEMIFINALS_1,
    MATCHES.SEMIFINALS_2,
    MATCHES.FINALS
  ];

  const matchTable: {[key in MATCHES]: [MATCHES, number]} = {
    [MATCHES.FIRST_ROUND_1]: [MATCHES.QUARTERFINALS_1, 1],
    [MATCHES.FIRST_ROUND_2]: [MATCHES.QUARTERFINALS_1, 2],
    [MATCHES.FIRST_ROUND_3]: [MATCHES.QUARTERFINALS_2, 1],
    [MATCHES.FIRST_ROUND_4]: [MATCHES.QUARTERFINALS_2, 2],
    [MATCHES.FIRST_ROUND_5]: [MATCHES.QUARTERFINALS_3, 1],
    [MATCHES.FIRST_ROUND_6]: [MATCHES.QUARTERFINALS_3, 2],
    [MATCHES.FIRST_ROUND_7]: [MATCHES.QUARTERFINALS_4, 1],
    [MATCHES.FIRST_ROUND_8]: [MATCHES.QUARTERFINALS_4, 2],
    [MATCHES.QUARTERFINALS_1]: [MATCHES.SEMIFINALS_1, 1],
    [MATCHES.QUARTERFINALS_2]: [MATCHES.SEMIFINALS_1, 2],
    [MATCHES.QUARTERFINALS_3]: [MATCHES.SEMIFINALS_2, 1],
    [MATCHES.QUARTERFINALS_4]: [MATCHES.SEMIFINALS_2, 2],
    [MATCHES.SEMIFINALS_1]: [MATCHES.FINALS, 1],
    [MATCHES.SEMIFINALS_2]: [MATCHES.FINALS, 2],
    [MATCHES.FINALS]: [MATCHES.FINALS, 3]
  }

  const confRef = db.collection("site_config").doc("current");
  let currentSiteConfig: SiteConfig;

  try {

    currentSiteConfig = (await confRef.get()).data() as SiteConfig;

  } catch(err) {
    logger.error(err);
    return false;
  }

  if (currentSiteConfig.mode == SITE_MODE.VOTING) {

    if (currentSiteConfig.voting_ends <= currentTime.getTime()) {

      logger.log(`Switching match`);

      const matchIndex = matchOrder.indexOf(currentSiteConfig.current_match);

      const matchRef = db.collection("matches").doc(matchOrder[matchIndex]);
      const matchInfo = (await matchRef.get()).data() as Match;

      // Get match info
      let winner;
      let loser; 
      let winnerTwitterVotes, winnerWebVotes;
      let loserTwitterVotes, loserWebVotes;
      
      if ((matchInfo.contestant1TwitterVotes + matchInfo.contestant1WebsiteVotes) > (matchInfo.contestant2TwitterVotes + matchInfo.contestant2WebsiteVotes)) {
        winner = matchInfo.contestant1;
        winnerTwitterVotes = matchInfo.contestant1TwitterVotes;
        winnerWebVotes = matchInfo.contestant1WebsiteVotes;
        loser = matchInfo.contestant2;
        loserTwitterVotes = matchInfo.contestant2TwitterVotes;
        loserWebVotes = matchInfo.contestant2WebsiteVotes;
      } else {
        winner = matchInfo.contestant2;
        winnerTwitterVotes = matchInfo.contestant2TwitterVotes;
        winnerWebVotes = matchInfo.contestant2WebsiteVotes;
        loser = matchInfo.contestant1;
        loserTwitterVotes = matchInfo.contestant1TwitterVotes;
        loserWebVotes = matchInfo.contestant1WebsiteVotes;
      }

      // Load results into lineup table
      let newLineup: {[key in MATCHES]: LineupMatch} = {
        ...currentSiteConfig.lineup,
        [matchOrder[matchIndex]]: {
          ...currentSiteConfig.lineup[matchOrder[matchIndex]],
          results: {
            winner: winner,
            winnerTwitterVotes: winnerTwitterVotes,
            winnerWebVotes: winnerWebVotes,
            loser: loser,
            loserTwitterVotes: loserTwitterVotes,
            loserWebVotes: loserWebVotes
          }
        }
      }

      if (matchIndex == matchOrder.length - 1) {

        const newSiteConf: SiteConfig = {
          mode: SITE_MODE.WINNER,
          lineup: newLineup,
          winner: winner,
          contestants: currentSiteConfig.contestants
        }

        //Set winner
        await confRef.set(newSiteConf);

      } else {

        const nextMatchIndex = matchIndex + 1;
        const nextSlot = matchTable[matchOrder[matchIndex]];

        newLineup = {
          ...newLineup,
          [nextSlot[0]]: {
            ...newLineup[nextSlot[0]],
            [`contestant${nextSlot[1]}`]: winner
          }
        }

        const newMatch = {
          contestant1: newLineup[matchOrder[nextMatchIndex]].contestant1,
          contestant1TwitterVotes: 0,
          contestant1WebsiteVotes: 0,
          contestant2: newLineup[matchOrder[nextMatchIndex]].contestant2,
          contestant2TwitterVotes: 0,
          contestant2WebsiteVotes: 0
        }

        const matchRef = db.collection("matches").doc(matchOrder[nextMatchIndex]);
        await matchRef.set(newMatch);

        const newSiteConf: SiteConfig = {
          mode: SITE_MODE.VOTING,
          lineup: newLineup,
          current_match: matchOrder[nextMatchIndex],
          voting_ends: currentTime.getTime() + votingTime,
          contestants: currentSiteConfig.contestants
        }

        await confRef.set(newSiteConf)
        
      }

    } else {
      logger.log(`Not yet time to switch match! ${currentSiteConfig.voting_ends} ${currentTime.getTime()}`);
      return false;
    }
  } else if (currentSiteConfig.mode == SITE_MODE.NOMINATION) {

    if ((currentSiteConfig.contestants) && (currentSiteConfig.lineup)) {

      const newMatch = {
        contestant1: currentSiteConfig.lineup[matchOrder[0]].contestant1,
        contestant1TwitterVotes: 0,
        contestant1WebsiteVotes: 0,
        contestant2: currentSiteConfig.lineup[matchOrder[0]].contestant2,
        contestant2TwitterVotes: 0,
        contestant2WebsiteVotes: 0
      }

      const matchRef = db.collection("matches").doc(matchOrder[0]);
      await matchRef.set(newMatch);
      
      const newSiteConf: SiteConfig = {
        mode: SITE_MODE.VOTING,
        current_match: matchOrder[0],
        voting_ends: currentTime.getTime() + votingTime,
        lineup: currentSiteConfig.lineup,
        contestants: currentSiteConfig.contestants
      }

      await confRef.set(newSiteConf)

    }
  }
  
  return true;

}

export default archiveOldChatRooms;