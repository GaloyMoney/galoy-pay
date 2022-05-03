import * as React from "react"
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

const httpLink = new HttpLink({
  uri: publicRuntimeConfig.graphqlUri,
})

const wsLink = new WebSocketLink({
  uri: publicRuntimeConfig.graphqlSubscriptionUri,
  options: {
    reconnect: true,
  },
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" && definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export default ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)
