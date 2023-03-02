import Head from "next/head"
import type { AppProps } from "next/app"

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { ApolloLink } from "@apollo/client"

import config from "../config"

import "../styles/main.css"

function MyApp({ Component, pageProps }: AppProps) {
  const { GRAPHQL_URL, GALOY_AUTH_ENDPOINT } = config()

  const cache = new InMemoryCache()
  const httpLink = new HttpLink({ uri: GRAPHQL_URL, fetch, credentials: "include" })

  const authLink = setContext((_, { headers }) => {
    if (typeof window === "undefined") {
      return headers
    }
    return {
      headers: {
        ...headers,
      },
    }
  })

  const errorLink = onError(({ networkError }) => {
    if (networkError && networkError.message.includes("Failed to fetch")) {
      fetch(GALOY_AUTH_ENDPOINT + "/clearCookies", {
        method: "GET",
        redirect: "follow",
        credentials: "include",
      })
      localStorage.clear()
      sessionStorage.clear()
    }
  })

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
    cache,
    credentials: "include",
  })

  return (
    <>
      <Head>
        <title>Admin Panel</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Galoy admin panel" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}

export default MyApp
