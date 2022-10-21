import React from 'react';
import styles from './Header.module.css';

type Props = {}

const Header = (props: Props) => {

  return (
    <header className={styles.header}>
      <nav className={styles['header-wrapper']}>
        <div className={styles.cell}>
          <img className={styles.logo} src="/images/MonoLogoWhite.svg" />
        </div>
      </nav>
    </header>
  );
}

export default Header;