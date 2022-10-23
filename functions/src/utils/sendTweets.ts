import TwitterApi from 'twitter-api-v2';
import * as request from 'request-promise';
import { db } from '../firebase/admin';
import { Match, MATCHES, SiteConfig, SITE_MODE } from '../firebase/schema';
import * as sharp from 'sharp';
import { logger } from 'firebase-functions/v1';

async function getImageData(image1Url: string, image2Url: string, backgroundImageUrl: string): Promise<Buffer> {
  //const image1Buffer = (await request(`https://www.griftathon.com${image1Url}`)).data as Buffer;
  //const image2Buffer = (await request(`https://www.griftathon.com${image2Url}`)).data as Buffer;
  const backgroundBuffer = (await request(`https://www.griftathon.com${backgroundImageUrl}`)).data;

  logger.log(backgroundBuffer)

  const editedImage = sharp(backgroundBuffer);

  const buff = await editedImage.toFormat("png").toBuffer();

  logger.log(buff);

  return buff;
}

async function sendTweets(current_match: Match, site_config: SiteConfig): Promise<string> {

  const twitterInfoRef = db.collection("twitter_info").doc("current");
  const twitterInfo = await (await twitterInfoRef.get()).data();

  if (!twitterInfo) throw new Error("Unable to find current twitter info");

  if (site_config.mode != SITE_MODE.VOTING) throw new Error("Not in voting state!");

  const userClient = new TwitterApi({
    appKey: twitterInfo.appKey,
    appSecret: twitterInfo.appSecret,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: twitterInfo.accessToken,
    accessSecret: twitterInfo.secret,
  });

  const rwClient = userClient.readWrite;


  //Upload image
  const imageId = await rwClient.v1.uploadMedia(
    await getImageData(
      site_config.contestants[current_match.contestant1].image,
      site_config.contestants[current_match.contestant2].image,
      "/images/OGImage.png"
    ), 
    {type: 'png'}
    );

  //Send first tweet
  const roundNames: {[key in MATCHES]: string} = {
    [MATCHES.FIRST_ROUND_1]: "ROUND 1",
    [MATCHES.FIRST_ROUND_2]: "ROUND 2",
    [MATCHES.FIRST_ROUND_3]: "ROUND 3",
    [MATCHES.FIRST_ROUND_4]: "ROUND 4",
    [MATCHES.FIRST_ROUND_5]: "ROUND 5",
    [MATCHES.FIRST_ROUND_6]: "ROUND 6",
    [MATCHES.FIRST_ROUND_7]: "ROUND 7",
    [MATCHES.FIRST_ROUND_8]: "ROUND 8",
    [MATCHES.QUARTERFINALS_1]: "QUARTERFINALS ROUND 1",
    [MATCHES.QUARTERFINALS_2]: "QUARTERFINALS ROUND 2",
    [MATCHES.QUARTERFINALS_3]: "QUARTERFINALS ROUND 3",
    [MATCHES.QUARTERFINALS_4]: "QUARTERFINALS ROUND 4",
    [MATCHES.SEMIFINALS_1]: "SEMIFINALS ROUND 1",
    [MATCHES.SEMIFINALS_2]: "SEMIFINALS ROUND 2",
    [MATCHES.FINALS]: "FINAL ROUND"
  }

  const firstTweetInfo = await rwClient.v2.tweet(
    `${roundNames[site_config.current_match]}: ${site_config.contestants[current_match.contestant1]} VS ${site_config.contestants[current_match.contestant2]} #GRIFTATHON2022 https://www.griftathon.com`, 
    { 
      media: {
        media_ids: [imageId] 
      }
    }
  );

  //Send poll reply
  const pollTweetInfo = await rwClient.v2.tweet(
    `${site_config.contestants[current_match.contestant1].name} VS ${site_config.contestants[current_match.contestant2].name}`, 
    { 
      reply:{ 
        in_reply_to_tweet_id: firstTweetInfo.data.id 
      }, 
      poll:{
        duration_minutes: Math.ceil((site_config.voting_ends - (new Date().getTime())) / (1000 * 60)),
        options: [
          site_config.contestants[current_match.contestant1].name,
          site_config.contestants[current_match.contestant2].name
        ]
      } 
    })

  //Return poll ID
  return pollTweetInfo.data.id
}

export default sendTweets;