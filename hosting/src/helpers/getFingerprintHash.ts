import { load } from '@fingerprintjs/fingerprintjs'

export default async function getFingerprintHash() {
  const fingerprint = await load();
  const result = await fingerprint.get();

  return result.visitorId;
}