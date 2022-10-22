import { useEffect, useState } from "react";
import { db } from "../app";
import { SiteConfig, Match, SITE_MODE, MATCHES } from "../schema";
import { doc, onSnapshot } from "firebase/firestore";

export default function useSiteConfig(modeOverride?: string | string[]): [SiteConfig, Match] {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | undefined>();
  const [match, setMatch] = useState<Match | undefined>();

  useEffect(()=>{

    if (!window) {
      return;
    }

    let matchListener = null;
    let currentMatch = null;
    
    const unsub = onSnapshot(doc(db, "site_config", "current"), (configDoc) => {

      if (!configDoc.exists()) return;

      const newConfig = configDoc.data() as SiteConfig;

      setSiteConfig( newConfig );

      if (newConfig.mode == SITE_MODE.VOTING) {

        if (currentMatch != newConfig.current_match) {
          if (matchListener) matchListener();

          matchListener = onSnapshot(doc(db, "matches", newConfig.current_match), (matchDoc)=> {

            if (!matchDoc.exists()) return;

            const match = matchDoc.data() as Match

            setMatch( match )
          })
        }

      }

    });

    return () => {
      if (unsub) unsub();
      if (matchListener) matchListener();
    }

  }, [])

  return [siteConfig, match];
  
}