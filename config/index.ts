const config = () => {
  const isBrowser = typeof window !== "undefined"

  if (isBrowser) {
    return window.__NEXT_DATA__.props.pageProps.publicConfig
  }

  return {
    GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  }
}

export default config
