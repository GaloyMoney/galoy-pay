import { NextResponse } from "next/server"

import {
  ApolloClient,
  ApolloLink,
  concat,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"

import { GRAPHQL_URL_INTERNAL, NOSTR_PUBKEY } from "../../../lib/config"
import {
  AccountDefaultWalletDocument,
  AccountDefaultWalletQuery,
} from "../../../lib/graphql/generated"
import { URL_HOST_DOMAIN } from "../../../config/config"

const ipForwardingMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-real-ip": operation.getContext()["x-real-ip"],
      "x-forwarded-for": operation.getContext()["x-forwarded-for"],
    },
  }))

  return forward(operation)
})

const client = new ApolloClient({
  link: concat(
    ipForwardingMiddleware,
    new HttpLink({
      uri: GRAPHQL_URL_INTERNAL,
    }),
  ),
  cache: new InMemoryCache(),
})

gql`
  query accountDefaultWallet($username: Username!, $walletCurrency: WalletCurrency!) {
    accountDefaultWallet(username: $username, walletCurrency: $walletCurrency) {
      __typename
      id
      walletCurrency
    }
  }

  mutation lnInvoiceCreateOnBehalfOfRecipient(
    $walletId: WalletId!
    $amount: SatAmount!
    $descriptionHash: Hex32Bytes!
  ) {
    mutationData: lnInvoiceCreateOnBehalfOfRecipient(
      input: {
        recipientWalletId: $walletId
        amount: $amount
        descriptionHash: $descriptionHash
      }
    ) {
      errors {
        message
      }
      invoice {
        paymentRequest
        paymentHash
      }
    }
  }
`

const nostrEnabled = !!NOSTR_PUBKEY

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  console.log(NOSTR_PUBKEY)

  const username = params.username

  const accountUsername = username ? username.toString() : ""

  let walletId: string | null = null

  try {
    const { data } = await client.query<AccountDefaultWalletQuery>({
      query: AccountDefaultWalletDocument,
      variables: { username: accountUsername, walletCurrency: "BTC" },
      context: {
        "x-real-ip": request.headers.get("x-real-ip"),
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
      },
    })
    walletId = data?.accountDefaultWallet?.id
  } catch (err: unknown) {
    console.log(err)
  }

  if (!walletId) {
    return NextResponse.json({
      status: "ERROR",
      reason: `Couldn't find user '${username}'.`,
    })
  }

  const metadata = JSON.stringify([
    ["text/plain", `Payment to ${accountUsername}`],
    ["text/identifier", `${accountUsername}@${URL_HOST_DOMAIN}`],
  ])

  const payServer = GRAPHQL_URI.replace("/graphql", "").replace("api", "pay")
  const callback = `${payServer}/lnurlp/${username}/callback`

  return NextResponse.json({
    callback,
    minSendable: 1000,
    maxSendable: 100000000000,
    metadata,
    tag: "payRequest",
    ...(nostrEnabled
      ? {
          allowsNostr: true,
          nostrPubkey: NOSTR_PUBKEY,
        }
      : {}),
  })
}
