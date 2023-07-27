let GRAPHQL_HOSTNAME = process.env.NEXT_PUBLIC_GRAPHQL_HOSTNAME
let GRAPHQL_WEBSOCKET_URL = process.env.NEXT_PUBLIC_GRAPHQL_WEBSOCKET_URL ?? ""

// we need an internal dns to properly propagate the ip related headers to api
// if we use the api endpoints, nginx will rewrite the header to prevent spoofing
// for example: "api.galoy-name-galoy.svc.cluster.local"
const GRAPHQL_HOSTNAME_INTERNAL = process.env.GRAPHQL_HOSTNAME_INTERNAL as string
const GRAPHQL_URI_INTERNAL = `http://${GRAPHQL_HOSTNAME_INTERNAL}/graphql`

// from https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
// Note: After being built, your app will no longer respond to changes to these environment variables.
// For instance, if you use a Heroku pipeline to promote slugs built in one environment to another environment,
// or if you build and deploy a single Docker image to multiple environments, all NEXT_PUBLIC_ variables will be frozen with the value evaluated at build time,
// so these values need to be set appropriately when the project is built. If you need access to runtime environment values,
// you'll have to setup your own API to provide them to the client (either on demand or during initialization).

// so we always assume the api is on the same domain as the frontend
if (!GRAPHQL_HOSTNAME) {
  if (typeof window !== "undefined") {
    const hostParts = window.location.host.split(".")

    hostParts[0] = "api"
    GRAPHQL_HOSTNAME = hostParts.join(".")

    hostParts[0] = "ws"
    GRAPHQL_WEBSOCKET_URL = `wss://${hostParts.join(".")}/graphql`
  } else {
    console.log("window is undefined")
  }
}

const GRAPHQL_URI = `https://${GRAPHQL_HOSTNAME}/graphql`
const GRAPHQL_SUBSCRIPTION_URI = GRAPHQL_WEBSOCKET_URL

const NOSTR_PUBKEY = process.env.NOSTR_PUBKEY as string

export { GRAPHQL_URI, GRAPHQL_SUBSCRIPTION_URI, GRAPHQL_URI_INTERNAL, NOSTR_PUBKEY }
