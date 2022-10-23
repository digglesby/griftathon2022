import { db } from '../firebase/admin';
import * as functions from "firebase-functions";
import { logger } from 'firebase-functions/v1';
import { Match, SiteConfig, SITE_MODE } from '../firebase/schema';

import TwitterApi from 'twitter-api-v2';

/**
 * Switch match
 */

async function checkTwitterPoll(context: functions.EventContext) {

  const confRef = db.collection("site_config").doc("current");
  let currentSiteConfig: SiteConfig;

  try {

    currentSiteConfig = (await confRef.get()).data() as SiteConfig;

  } catch(err) {
    logger.error(err);
    return false;
  }

  if (currentSiteConfig.mode != SITE_MODE.VOTING) return true;

  const matchRef = db.collection("matches").doc(currentSiteConfig.current_match);
  let currentMatch: Match;

  try {

    currentMatch = (await matchRef.get()).data() as Match;

  } catch(err) {
    logger.error(err);
    return false;
  }

  if (!currentMatch.twitterPollId) return false;


  const twitterInfoRef = db.collection("twitter_info").doc("current");
  const twitterInfo = await (await twitterInfoRef.get()).data();

  if (!twitterInfo) throw new Error("Unable to find current twitter info");

  const userClient = new TwitterApi({
    appKey: twitterInfo.appKey,
    appSecret: twitterInfo.appSecret,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: twitterInfo.accessToken,
    accessSecret: twitterInfo.secret,
  });

  const data = await userClient.v2.tweets(currentMatch.twitterPollId, { "expansions": ["attachments.poll_ids"] });

  if ((!data.includes) || (!data.includes.polls)) {
    logger.error("No polls returned!");
    return false;
  }

  await matchRef.update({
    contestant1TwitterVotes: data.includes.polls[0].options[0].votes,
    contestant2TwitterVotes: data.includes.polls[0].options[1].votes
  })
  
  return true;
}

export default checkTwitterPoll;