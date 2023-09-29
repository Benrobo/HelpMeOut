import "../styles/globals.css";
import "../styles/nprogress.css";
import nProgress from "nprogress";
import {
  ppB,
  ppEB,
  ppReg,
  ppSB,
  soraB,
  soraEB,
  soraReg,
} from "../config/fonts";
import { Router } from "next/router";
import ErrorBoundary from "../components/ErrorBoundary";

// nprogress loader
Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-ppReg: ${ppReg.style.fontFamily};
            --font-ppB: ${ppB.style.fontFamily};
            --font-ppEB: ${ppEB.style.fontFamily};
            --font-ppSB: ${ppSB.style.fontFamily};
            --font-soraReg: ${soraReg.style.fontFamily};
            --font-soraB: ${soraB.style.fontFamily};
            --font-soraEB: ${soraEB.style.fontFamily};
          }
        `}
      </style>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}
