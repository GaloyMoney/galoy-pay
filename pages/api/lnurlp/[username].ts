import crypto from "crypto"
import originalUrl from "original-url"
import {
  ApolloClient,
  ApolloLink,
  concat,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import type { NextApiRequest, NextApiResponse } from "next"

import { GRAPHQL_URI_INTERNAL } from "../../../lib/config"

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
      uri: GRAPHQL_URI_INTERNAL,
    }),
  ),
  cache: new InMemoryCache(),
})

const ACCOUNT_DEFAULT_WALLET = gql`
  query accountDefaultWallet($username: Username!) {
    accountDefaultWallet(username: $username) {
      __typename
      id
      walletCurrency
    }
  }
`

const LNURL_INVOICE = gql`
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
      }
    }
  }
`

const LNURL_USD_INVOICE = gql`
  mutation lnUsdInvoiceCreateOnBehalfOfRecipient(
    $walletId: WalletId!
    $amount: CentAmount!
    $descriptionHash: Hex32Bytes!
  ) {
    mutationData: lnUsdInvoiceCreateOnBehalfOfRecipient(
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
      }
    }
  }
`

const BTC_PRICE = gql`
  query btcPrice {
    btcPrice {
      base
      offset
      currencyUnit
      formattedAmount
    }
  }
`

const walletUnitCurrency = {
  BTC: "BTC",
  USD: "USD",
} as const

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { username, amount } = req.query
  const url = originalUrl(req)

  console.log({ headers: req.headers }, "request to NextApiRequest")

  let accountUsername: string
  if (username == undefined) {
    accountUsername = ""
  } else {
    accountUsername = username.toString()
  }
  let walletId
  let walletCurrency

  try {
    const { data } = await client.query({
      query: ACCOUNT_DEFAULT_WALLET,
      variables: { username: accountUsername },
      context: {
        "x-real-ip": req.headers["x-real-ip"],
        "x-forwarded-for": req.headers["x-forwarded-for"],
      },
    })
    walletId = data?.accountDefaultWallet?.id ? data?.accountDefaultWallet?.id : ""
    walletCurrency = data?.accountDefaultWallet?.walletCurrency
  } catch (error) {
    return res.json({
      status: "ERROR",
      reason: `Couldn't find user '${username}'.`,
    })
  }

  console.log({ headers: req.headers }, "request to NextApiRequest")

  const metadata = JSON.stringify([
    ["text/plain", `Payment to ${username}`],
    ["text/identifier", `${username}@${url.hostname}`],
  ])

  if (amount) {
    if (Array.isArray(amount)) {
      throw new Error("Invalid request")
    }
    // second call, return invoice
    const amountSats = Math.round(parseInt(amount, 10) / 1000)
    if ((amountSats * 1000).toString() !== amount) {
      return res.json({
        status: "ERROR",
        reason: "Millisatoshi amount is not supported, please send a value in full sats.",
      })
    }

    try {
      const descriptionHash = crypto.createHash("sha256").update(metadata).digest("hex")
      if (walletCurrency === walletUnitCurrency.BTC) {
        const {
          data: {
            mutationData: { errors, invoice },
          },
        } = await client.mutate({
          mutation: LNURL_INVOICE,
          variables: {
            walletId,
            amount: amountSats,
            descriptionHash,
          },
        })
        if (errors && errors.length) {
          console.log("error getting invoice", errors)
          return res.json({
            pr: invoice.paymentRequest,
            routes: [],
          })
        }
      } else {
        const {
          data: { btcPrice },
          error: priceDataErrors,
          loading: loadingPriceData,
        } = await client.query({
          query: BTC_PRICE,
          context: {
            "x-real-ip": req.headers["x-real-ip"],
            "x-forwarded-for": req.headers["x-forwarded-for"],
          },
        })
        const { base, offset } = btcPrice
        const price = base / 10 ** offset
        const centAmount = Math.round(amountSats * price)

        if (!loadingPriceData && centAmount) {
          const {
            data: {
              mutationData: { errors, invoice },
            },
          } = await client.mutate({
            mutation: LNURL_USD_INVOICE,
            variables: {
              walletId,
              amount: centAmount,
              descriptionHash,
            },
          })
          if (errors && errors.length) {
            console.log("error getting invoice", errors)
            return res.json({
              status: "ERROR",
              reason: `Failed to get invoice: ${errors[0].message}`,
            })
          }
          return res.json({
            pr: invoice.paymentRequest,
            routes: [],
          })
        }
        if (priceDataErrors) {
          console.log({ priceDataErrors })
          throw new Error(priceDataErrors.message)
        }
      }
    } catch (err: unknown) {
      console.log("unexpected error getting invoice", err)
      res.json({
        status: "ERROR",
        reason: err instanceof Error ? err.message : "unexpected error",
      })
    }
  } else if (walletCurrency === walletUnitCurrency.USD) {
    // first call if USD
    res.json({
      callback: url.full,
      minSendable: 100000,
      maxSendable: 500000000,
      metadata: metadata,
      tag: "payRequest",
    })
  } else {
    // first call if BTC
    res.json({
      callback: url.full,
      minSendable: 1000,
      maxSendable: 500000000,
      metadata: metadata,
      tag: "payRequest",
    })
  }
}
