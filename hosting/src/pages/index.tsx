import { useState } from 'react';
import Layout from '../components/Layout';
import NominationModal from '../components/NominationModal';
import styles from '../page_styles/index.module.css'
import {SiteConfig, Match, SITE_MODE, MATCHES} from '../firebase/schema';
import useSiteConfig from '../firebase/hooks/useSiteConfig';
import { useRouter } from 'next/router';
import BracketTree from '../components/BracketTree';
import VotingSection from '../components/VotingSection';
import Candidates from '../components/Candidates';
import Header from '../components/Layout/Header';
import VotingModal from '../components/VotingModal';
import Head from 'next/head'

type Props = {
  siteInfo: SiteConfig,
  currentMatch?: Match
}

const ExplainerSection = (props: { light?: boolean }) => (
  <div className={`${styles.explainer} ${(props.light ? styles.light : '')}`}>

    <div className={styles.explainerContainer}>

      <h1>What is GRIFTATHON 2022?</h1>
      <p>GRIFTATHON is an annual* poll held to find the greatest Grifter in the China/U.S. political space. From podcasters to scholars, from book sales to atrocity denial, all compete for bragging rights and the coveted "COMMANDER-IN-GRIFT" title.</p>
      <p>Former nominees include&nbsp;
        <a href='https://podcasts.apple.com/au/podcast/silk-steel-podcast-82-womens-forum-on-misogyny-harassment/id1451115518?i=1000490306781'>Tom Fowdy</a>, <a href='https://www.nbcnews.com/tech/security/how-fake-persona-laid-groundwork-hunter-biden-conspiracy-deluge-n1245387'>Christopher Balding</a>, and <a href='https://www.cnn.com/2021/06/29/politics/solomon-yue-on-white-nationalist/index.html'>Solomon Yue</a>
      </p>

      <aside>

        <div>
          <img src="/images/group.svg" alt="Group of people" />
          <p>16 competitors</p>
        </div>

        <div>
          <img src="/images/ballot.svg" alt="Balot box" />
          <p>13,232 votes cast</p>
        </div>

        <div>
        <img src="/images/medal.svg" alt="Medal" />
          <p>1 Commander-in-grift</p>
        </div>
      </aside>

      <sub>* I missed 2021, blame COVID</sub>

    </div>

  </div>
);

const WhatIsSection = () => (
  <div className={styles.whatIsGrift}>

    <div className={styles.whatIsGriftContainer}>
        
      <h1>What counts as a grift?</h1>
      <blockquote cite="https://www.merriam-webster.com/dictionary/grift">
        <h2>Grift</h2>
        <p>
          <span>Verb</span>
          To obtain (money or property) illicitly
        </p>
      </blockquote>

      <p>
        In the context of GRIFTATHON a "grift" is considered any intentional dishonesty or bad faith interpretation of facts for either personal or ideological gain. Especially if that bad faith interpretation is presented from a position of authority.
      </p>

    </div>

  </div>

);

const NominationSection = (props: {openModal: () => void}) => (
  <div className={styles.nomination}>

    <div className={styles.nominationContainer}>

      <h1>How do I nominate someone?</h1>

      <p>
        Anyone can be nominated by filling out the form below. Nominees will be reviewed and placed into brackets by a team of volunteers, and voting will begin December 10th.
      </p>
      <p>
        A good nominee should:
      </p>
      <ul>
        <li>Be a public figure, or have presented their work in a professional setting</li>
        <li>Have an obvious grift or instance of malfeasance during the year</li>
        <li>Not work in a direct public capacity for the U.S. or Chinese governments</li>
      </ul>
      <button onClick={props.openModal}>Submit Nominatation</button>

    </div>

  </div>
);

const Home = () => {
  const router = useRouter();
  const [nominationModalOpen, setNominationModalOpen] = useState(false);
  const [votingModalCandidate, setVotingModalCandidate] = useState<string | null>(null);
  const [siteConfig, match] = useSiteConfig(router.query['mode']);

  console.log(votingModalCandidate)

  if (!siteConfig) {
    return null;
  }

  if ((siteConfig.mode == SITE_MODE.NOMINATION) || (siteConfig.mode == SITE_MODE.INFO)) {
    return (
      <Layout hideHeader>

        <Head>
          <title>GRIFTATHON 2022</title>
        </Head>

        {(nominationModalOpen) ? <NominationModal onClose={()=>setNominationModalOpen(false)} /> : null }

        <div className={styles.atf}>

          <div className={styles['img-wrapper']}>
            <div className={styles['logo-wrapper']}>
            <img className={styles['spin']} src="/images/spinner.svg" />
            <img className={styles.logo} src="/images/ColorLogo.svg" alt="GRIFTATHON 2022" />
              
            </div>
          </div>

          <div className={styles['text-wrapper']}>

            <div className={styles.atfText}>
              <h1>{ (siteConfig.mode == SITE_MODE.NOMINATION) ? "Nominations now open!" : "GRIFTATHON is back!" }</h1>
              <p>Back after a year, Grifathon 2022 is here to celibrate the greatest grifts in the China space.</p>
              
            </div>

            {(siteConfig.mode == SITE_MODE.NOMINATION) ? <button onClick={()=>setNominationModalOpen(true)}>Submit Nominatation</button> : null}
          </div>

        </div>

        <ExplainerSection light />

        <WhatIsSection />

        {(siteConfig.mode == SITE_MODE.NOMINATION) ? (

          <NominationSection 
            openModal={()=>setNominationModalOpen(true)}
          />

        ) : (
          <div>

          </div>
        )
      }
      </Layout>
    )
  } else {

    return (
      <Layout hideHeader>

        <Head>
          <title>GRIFTATHON 2022</title>
        </Head>

        {(votingModalCandidate !== null) ? <VotingModal candidate={votingModalCandidate} match={match} siteConfig={siteConfig} onClose={()=>setVotingModalCandidate(null)}/> : null}

        <main className={styles.bracketBg}>
          <Header />
          <BracketTree siteConfig={siteConfig} currentMatch={match} setCandidate={setVotingModalCandidate} />
        </main>
        <main>
          <VotingSection siteConfig={siteConfig} currentMatch={match} setCandidate={setVotingModalCandidate}/>
        </main>
        
        <Candidates siteConfig={siteConfig} />
        <ExplainerSection />
      </Layout>
    )
  }
}

export async function getStaticProps() {
  return { props: {
    siteInfo: {
      mode: SITE_MODE.INFO
    }
  }}
}

export async function getInitialProps({ query }) {


}


export default Home