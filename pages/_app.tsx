import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import Head from "next/head"
import dynamic from "next/dynamic"
import { NextPage } from "next"
import React from "react"
import { useRouter } from "next/router"
import manifest from "../public/manifest.json"

const GraphQLProvider = dynamic(() => import("../lib/graphql"), { ssr: false })

export default function Layout({
  Component,
  pageProps,
}: {
  Component: NextPage
  pageProps: Record<string, unknown>
}) {
  const { username } = useRouter().query

  React.useEffect(() => {
    if (username) {
      const manifestElement = document.getElementById("manifest")
      const manifestString = JSON.stringify({
        ...manifest,
        scope: `/merchant/${username}`,
        start_url: `/merchant/${username}`,
      })
      manifestElement?.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(manifestString),
      )
    }
  }, [username])
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="lang" content="en" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#536FF2" />
        <meta name="apple-mobile-web-app-status-bar" content="#536FF2" />
        <meta
          name="description"
          content="Bitcoin Beach official lightning network node"
        />
        <link rel="apple-touch-icon" href="/manifest/logo72x72.svg" color="#536FF2" />
        <link rel="manifest" href="/manifest.json" id="manifest" />
        <link
          rel="icon"
          type="image/svg"
          sizes="72x72"
          href="/manifest/logo72x72.svg"
        />
        <link rel="mask-icon" href="/manifest/logo72x72.svg" color="#536FF2" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-181044262-1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-181044262-1');
    `,
          }}
        />
        <title>BitcoinBeach Lightning Node</title>
      </Head>
      <GraphQLProvider>
        <Component {...pageProps} />
      </GraphQLProvider>
    </>
  )
}
