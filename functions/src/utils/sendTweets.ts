import TwitterApi from 'twitter-api-v2';
import * as request from 'request-promise';
import { db } from '../firebase/admin';
import { Match, MATCHES, SiteConfig, SITE_MODE } from '../firebase/schema';
import * as sharp from 'sharp';

const hostname = "https://www.griftathon.com"

async function getImageData(image1Url: string, image2Url: string): Promise<Buffer> {
  const fgBuffer = await request({ url: `${hostname}/images/TweetImgOverlay.png`, encoding: null});
  const pfp1Buffer = await request({ url: `${hostname}${image1Url}`, encoding: null });
  const pfp2Buffer = await request({ url: `${hostname}${image2Url}`, encoding: null });

  const pfp1 = await sharp(pfp1Buffer).resize(675,675).grayscale().toFormat("png").toBuffer();
  const pfp2 = await sharp(pfp2Buffer).resize(675,675).grayscale().toFormat("png").toBuffer();

  const editedImage = sharp({
    create: {
      width: 1200,
      height: 675,
      channels: 4,
      background: "#000"
    }
  }).composite([
    { input: pfp1, left: -75, top:0 },
    { input: pfp2, left: 600, top:0 },
    { input: fgBuffer, gravity: 'center' }
  ]);

  const buff = await editedImage.toFormat("png").toBuffer();

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
      site_config.contestants[current_match.contestant2].image
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
    `${roundNames[site_config.current_match]}: ${site_config.contestants[current_match.contestant1].name} VS ${site_config.contestants[current_match.contestant2].name} #GRIFTATHON2022 https://www.griftathon.com`, 
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