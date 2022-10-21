import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';


type Props = {
  children?: ReactNode,
  hideHeader?: boolean
}

const Layout = (props: Props) => {

  return (
    <>
      {(props.hideHeader) ? null : <Header />}
      {props.children}
      <Footer />
    </>
  );
}

export default Layout;