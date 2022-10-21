
export enum SITE_MODE {
  VOTING = 'VOTING',
  NOMINATION = 'NOMINATION',
  INFO = 'INFO'
}

export enum MATCHES {
  FIRST_ROUND_1 = 'FIRST_ROUND_1',
  FIRST_ROUND_2 = 'FIRST_ROUND_2',
  FIRST_ROUND_3 = 'FIRST_ROUND_3',
  FIRST_ROUND_4 = 'FIRST_ROUND_4',
  FIRST_ROUND_5 = 'FIRST_ROUND_5',
  FIRST_ROUND_6 = 'FIRST_ROUND_6',
  FIRST_ROUND_7 = 'FIRST_ROUND_7',
  FIRST_ROUND_8 = 'FIRST_ROUND_8',

  QUARTERFINALS_1 = 'QUARTERFINALS_1',
  QUARTERFINALS_2 = 'QUARTERFINALS_2',
  QUARTERFINALS_3 = 'QUARTERFINALS_3',
  QUARTERFINALS_4 = 'QUARTERFINALS_4',

  SEMIFINALS_1 = 'SEMIFINALS_1',
  SEMIFINALS_2 = 'SEMIFINALS_2',

  FINALS = 'FINALS',
}

export type Contestant = {
  name: string,
  description: string,
  image: string
}

export type LineupMatch = {
  contestant1?: string,
  contestant2?: string,
  results?: {
    winner: string,
    winnerWebVotes: number,
    winnerTwitterVotes: number,
    loser: string,
    loserWebVotes: number,
    loserTwitterVotes: number
  }
}

export type SiteConfig = {
  mode: SITE_MODE.INFO
} | {
  mode: SITE_MODE.NOMINATION
} | {
  mode: SITE_MODE.VOTING,
  current_match: MATCHES,
  contestants: {[key: string]: Contestant},
  lineup: {
    [key in MATCHES]: LineupMatch
  }
}

export type Match = {
  match: MATCHES,
  contestant1: string,
  contestant2: string,
  twitterPollId?: string,
  contestant1TwitterVotes: number,
  contestant1WebsiteVotes: number,
  contestant2TwitterVotes: number,
  contestant2WebsiteVotes: number,
}