import { NextResponse } from "next/server"

import {
  ApolloClient,
  ApolloLink,
  concat,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"

import { GRAPHQL_URL_INTERNAL, NOSTR_PUBKEY, PAY_SERVER } from "../../../lib/config"
import {
  AccountDefaultWalletDocument,
  AccountDefaultWalletQuery,
  RealtimePriceInitialDocument,
  RealtimePriceInitialQuery,
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
      fetchOptions: { cache: "no-store" },
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

  const { searchParams } = new URL(request.url)

  const username = params.username

  const amount = searchParams.get("amount")
  const currency = searchParams.get("currency")

  let amountInMsats: number | undefined

  if (amount && currency && currency !== "BTC") {
    const { data } = await client.query<RealtimePriceInitialQuery>({
      query: RealtimePriceInitialDocument,
      variables: { currency },
      context: {
        "x-real-ip": request.headers.get("x-real-ip"),
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
      },
    })

    const { base, offset } = data.realtimePrice.btcSatPrice
    const priceRef = base / 10 ** offset
    const convertedCurrencyAmount = Math.round(Number(amount) / priceRef)
    amountInMsats = convertedCurrencyAmount * 1000
  } else if (amount && Number.isInteger(Number(amount))) {
    amountInMsats = Number(amount) * 1000
  }

  let walletId: string | null = null

  try {
    const { data } = await client.query<AccountDefaultWalletQuery>({
      query: AccountDefaultWalletDocument,
      variables: { username, walletCurrency: "BTC" },
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
    ["text/plain", `Payment to ${username}`],
    ["text/identifier", `${username}@${URL_HOST_DOMAIN}`],
  ])

  const callback = `${PAY_SERVER}/lnurlp/${username}/callback`

  let minSendable = 1000 // 1 sat in millisat
  let maxSendable = 100000000000 // 1 BTC in millisat

  if (amountInMsats) {
    minSendable = amountInMsats
    maxSendable = amountInMsats
  }

  return NextResponse.json({
    callback,
    minSendable,
    maxSendable,
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
