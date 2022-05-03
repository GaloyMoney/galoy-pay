import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import Head from "next/head"
import dynamic from "next/dynamic"
import { NextPage } from "next"
import getConfig from "next/config"

import Header from "../components/header"

const GraphQLProvider = dynamic(() => import("../lib/graphql"), { ssr: false })

const { publicRuntimeConfig } = getConfig()

export default function Layout({
  Component,
  pageProps,
}: {
  Component: NextPage
  pageProps: Record<string, unknown>
}) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content={publicRuntimeConfig.appName + " official lightning network node"}
        />

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
        <title>{publicRuntimeConfig.appName} Lightning Node</title>
      </Head>
      <GraphQLProvider>
        <Header link={publicRuntimeConfig.appUri} />
        <Component {...pageProps} />
      </GraphQLProvider>
    </>
  )
}
