import React, { ReactNode } from 'react';
import Styles from './Footer.module.css'

type Props = {}

const Footer = (props: Props) => {

  return (
    <footer className={Styles.footer}>
      <div className={Styles.container}>
        <div>
          <p>All content provided by this site is for entertainment purposes only. GRIFTATHON makes no representations as to the accuracy or completeness of the information provided by this site. </p>
          <ul className={Styles.socials}>
            <li>
              <a href='https://www.twitter.com/griftathon'>
                <img src='/images/twitter.svg' />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p>Neither my CIA nor my United Front checks have cleared yet. Feel free to <a href="https://www.buymeacoffee.com/griftathon">buy me a coffee</a> for the server costs.</p>
    </footer>
  );
}

export default Footer;