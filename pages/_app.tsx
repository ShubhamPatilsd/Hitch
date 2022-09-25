import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <SessionProvider session={session}>
        {" "}
        <ToastContainer />
        <Component {...pageProps} />{" "}
      </SessionProvider>
    </>
  );
}

export default MyApp;
