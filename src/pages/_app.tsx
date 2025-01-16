import { Montserrat } from "next/font/google";
import type { AppProps } from "next/app";

import "../styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${montserrat.variable} ${montserrat.className}`}>
      <Component {...pageProps} />
    </main>
  );
}
