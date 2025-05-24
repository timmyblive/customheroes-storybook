import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS

// Prevent Font Awesome from adding its CSS automatically since we're importing it above
config.autoAddCss = false; 

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
