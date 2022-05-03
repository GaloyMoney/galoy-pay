module.exports = {
  rewrites() {
    return [
      { source: "/.well-known/lnurlp/:username", destination: "/api/lnurlp/:username" },
    ]
  },
  serverRuntimeConfig: {
    // we need an internal dns to properly propagate the ip related headers to api
    // if we use the api endpoints, nginx will rewrite the header to prevent spoofing
    // for example: "api.galoy-name-galoy.svc.cluster.local"
    graphqlUriInternal: process.env.GRAPHQL_URI_INTERNAL,
  },
  publicRuntimeConfig: {
    appName: process.env.APP_NAME,
    appUri: process.env.APP_URI,
    graphqlUri: process.env.GRAPHQL_URI,
    graphqlSubscriptionUri: process.env.GRAPHQL_SUBSCRIPTION_URI,
    storeLinks: {
      android: process.env.PLAY_STORE_LINK,
      ios: process.env.APP_STORE_LINK,
      huawei: process.env.APK_LINK,
      apk: process.env.APK_LINK,
    },
  },
}
