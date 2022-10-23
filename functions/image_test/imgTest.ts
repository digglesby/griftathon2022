import * as sharp from 'sharp';
import * as request from 'request-promise';

const hostname = "http://localhost:3000"

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


const run = async () => {
  
  const buffer = await getImageData("/images/headshots/CarlZha.jpg", "/images/headshots/CarlZha.jpg");

  sharp(buffer).toFile("out.png")
}

run();