import { Html, Head, NextScript, Main } from 'next/document'

// This default export is required in a new `pages/_app.js` file.
export default function Document() {
  return (
  <Html lang="en">
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#fff" />
      <meta name="theme-color" content="#ffffff"></meta>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato&family=Libre+Baskerville&display=swap" rel="stylesheet" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@griftathon" />
      <meta name="twitter:title" content="GRIFTATHON 2022" />
      <meta name="twitter:description" content="From podcasters to scholars, from book sales to atrocity denial, GRIFTATHON is an annual poll held to find the greatest Grifter in the China/US space."/>
      <meta name="twitter:image" content="https://www.griftathon.com/images/OGImage.png"></meta>
      <title>GRIFTATHON 2022</title>
    </Head>
    <body>
      <Main />
      <NextScript/>
    </body> 
  </Html>);
}