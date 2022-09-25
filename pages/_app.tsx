import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import useBeforeUnload from "../components/hooks/useBeforeUnload";

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <meta name="title" content="Hitch" />
        <title>Hitch</title>
        <link rel="shortcut icon" href="/thumbsup.png" />
        <meta name="description" content="Find a buddy to travel with." />
        <meta name="keywords" content="travel,hitchhike,buddy,alone" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
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
