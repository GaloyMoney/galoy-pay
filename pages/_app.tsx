import Head from "next/head"
import type { AppProps } from "next/app"

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import config from "../config"

import "../styles/main.css"

const { GRAPHQL_URL } = config()

const cache = new InMemoryCache()
const httpLink = new HttpLink({ uri: GRAPHQL_URL, fetch })

const authLink = setContext((_, { headers }) => {
  if (typeof window === "undefined") {
    return headers
  }
  const token = window.sessionStorage.getItem("token")
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

function MyApp({ Component, pageProps }: AppProps) {
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
