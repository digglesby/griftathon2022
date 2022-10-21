import { useEffect, useState } from "react";
import { SiteConfig, Match, SITE_MODE, MATCHES } from "../schema";

export default function useSiteConfig(modeOverride?: string | string[]): [SiteConfig, Match] {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | undefined>();
  const [match, setMatch] = useState<Match | undefined>();

  console.log(modeOverride)

  useEffect(()=>{

    if (!window) {
      return;
    }
    
    let mode: SITE_MODE = SITE_MODE.INFO;

    if (modeOverride) {
      if ( modeOverride == '0' ) {
        mode = SITE_MODE.INFO;
      } else if ( modeOverride == '1' ) {
        mode = SITE_MODE.NOMINATION;
      } else if ( modeOverride == '2' ) {
        mode = SITE_MODE.VOTING;
      }
    }

    const infoCase: SiteConfig = {
        mode: SITE_MODE.INFO
      }

    const nominationCase: SiteConfig = {
        mode: SITE_MODE.NOMINATION
    };

    const votingCase: SiteConfig = {
      mode: SITE_MODE.VOTING,
      current_match: MATCHES.SEMIFINALS_1,
      contestants: {
        dumb: {
          name: "Daniel Dumbrill",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/DanielDumbrill.jpg"
        },
        carl: {
          name: "Carl Zha",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/CarlZha.jpg"
        },
        qiao: {
          name: "Qiao Collective",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/Qiao.jpg"
        },
        gray: {
          name: "The Grayzone",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/Grayzone.jpg"
        },
        chan: {
          name: "Gordon Chang",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/Chang.jpg"
        },
        robe: {
          name: "Robert Spalding",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/RobertSpalding.jpg"
        },
        kyle: {
          name: "Kyle Bass",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/KyleBass.jpg"
        },
        lind: {
          name: "Linda Tang",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/LindaTang.jpg"
        },
        chin: {
          name: "Chin Wan",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/ChinWan.jpg"
        },
        mile: {
          name: "Miles Guo",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/MilesGuo.jpg"
        },
        tomf: {
          name: "Tom Fowdy",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/TomFowdy.jpg"
        },
        iang: {
          name: "Ian Goodrum",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/IanGoodrum.jpg"
        },
        solo: {
          name: "Solomon Yue",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/SolomonYue.jpeg"
        },
        huxi: {
          name: "Hu Xijin",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/HuXijin.jpeg"
        },
        shau: {
          name: "Shaun Rein",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/ShaunRein.jpg"
        },
        mari: {
          name: "Mario Cavolo",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor elementum pharetra.",
          image: "/images/headshots/MarioCavolo.jpg"
        },
      },
      lineup: {
        [MATCHES.FIRST_ROUND_1]: {
          contestant1: "dumb",
          contestant2: "carl",
          results: {
            winner: 'carl',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'dumb',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        }, 
        [MATCHES.FIRST_ROUND_2]: {
          contestant1: "qiao",
          contestant2: "gray",
          results: {
            winner: 'qiao',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'gray',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_3]: {
          contestant1: "chan",
          contestant2: "robe",
          results: {
            winner: 'robe',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'chan',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_4]: {
          contestant1: "kyle",
          contestant2: "lind",
          results: {
            winner: 'kyle',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'lind',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_5]: {
          contestant1: "chin",
          contestant2: "mile",
          results: {
            winner: 'mile',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'chin',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_6]: {
          contestant1: "tomf",
          contestant2: "iang",
          results: {
            winner: 'tomf',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'iang',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_7]: {
          contestant1: "solo",
          contestant2: "huxi",
          results: {
            winner: 'huxi',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'solo',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.FIRST_ROUND_8]: {
          contestant1: "shau",
          contestant2: "mari",
          results: {
            winner: 'shau',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'mari',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.QUARTERFINALS_1]: {
          contestant1: "carl",
          contestant2: "qiao",
          results: {
            winner: 'qiao',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'carl',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.QUARTERFINALS_2]: {
          contestant1: "robe",
          contestant2: "kyle",
          results: {
            winner: 'robe',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'kyle',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.QUARTERFINALS_3]: {
          contestant1: "mile",
          contestant2: "tomf",
          results: {
            winner: 'tomf',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'mile',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.QUARTERFINALS_4]: {
          contestant1: "huxi",
          contestant2: "shau",
          results: {
            winner: 'huxi',
            winnerWebVotes: 420,
            winnerTwitterVotes: 420,
            loser: 'shau',
            loserTwitterVotes: 69,
            loserWebVotes: 69
          }
        },
        [MATCHES.SEMIFINALS_1]: {
          contestant1: "qiao",
          contestant2: "robe"
        },
        [MATCHES.SEMIFINALS_2]: {
          contestant1: "tomf",
          contestant2: "huxi"
        },
        [MATCHES.FINALS]: {
        },
      }
    }

    const votingMatch: Match = {
      match: MATCHES.SEMIFINALS_1,
      contestant1: 'qiao',
      contestant2: 'robe',
      contestant1TwitterVotes: 12,
      contestant1WebsiteVotes: 6,
      contestant2WebsiteVotes: 56,
      contestant2TwitterVotes: 42
    }

    switch (mode) {

      case SITE_MODE.INFO:

        setSiteConfig(infoCase);
        setMatch(undefined);
        break;

      case SITE_MODE.NOMINATION:

        setSiteConfig(nominationCase);
        setMatch(undefined);
        break;

      case SITE_MODE.VOTING:

        setSiteConfig(votingCase);
        setMatch(votingMatch);
        break;

    }
  }, [modeOverride])

  return [siteConfig, match];
  
}