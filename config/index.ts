const config = () => {
  const isBrowser = typeof window !== "undefined"
  const GALOY_AUTH_ENDPOINT = process.env.NEXT_PUBLIC_GALOY_AUTH_ENDPOINT

  if (isBrowser) {
    return window.__NEXT_DATA__.props.pageProps.publicConfig
  }

  return {
    GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    GALOY_AUTH_ENDPOINT,
  }
}

export default config
