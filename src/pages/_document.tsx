import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link 
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Quicksand:wght@400;700&display=swap" 
            rel="stylesheet"
          />
          {/* Font Awesome CDN link removed as we are using the npm package */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
