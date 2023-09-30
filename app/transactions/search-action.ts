"use server"

import { redirect } from "next/navigation"
import {
  LightningInvoiceDocument,
  LightningInvoiceQuery,
  LightningPaymentDocument,
  LightningPaymentQuery,
  TransactionByIdDocument,
  TransactionByIdQuery,
  TransactionsByHashDocument,
  TransactionsByHashQuery,
} from "../../generated"
import { getClient } from "../graphql-rsc"

const isValidHash = (hash: string) => hash && hash.match(/^[a-f0-9]{64}$/i)
const isValidTxId = (id: string) => id && id.match(/^[0-9a-fA-F]{24}$/i)

export const transactionSearch = async (_prevState: unknown, formData: FormData) => {
  "use server"

  const search = formData.get("search") as string

  if (!search) {
    throw new Error("Please enter a value")
  }

  if (isValidHash(search)) {
    try {
      const data = await getClient().query<TransactionsByHashQuery>({
        query: TransactionsByHashDocument,
        variables: { hash: search },
      })

      const tx =
        data.data?.transactionsByHash &&
        data.data?.transactionsByHash.length > 0 &&
        data.data?.transactionsByHash[0]

      if (!!tx) {
        redirect(`/transactions/hash/${search}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }

    try {
      const data = await getClient().query<LightningPaymentQuery>({
        query: LightningPaymentDocument,
        variables: { hash: search },
      })

      const tx = data.data?.lightningPayment

      if (!!tx) {
        redirect(`/transactions/payment/${search}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }

    try {
      const data = await getClient().query<LightningInvoiceQuery>({
        query: LightningInvoiceDocument,
        variables: { id: search },
      })

      const invoice = data.data.lightningInvoice

      if (!!invoice) {
        redirect(`/transactions/invoice/${search}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }
  }
  if (isValidTxId(search)) {
    try {
      const data = await getClient().query<TransactionByIdQuery>({
        query: TransactionByIdDocument,
        variables: { id: search },
      })

      const tx = data.data?.transactionById

      if (!!tx) {
        redirect(`/transactions/id/${tx.id}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { message: `Failed to fetch: ${message}` }
    }
  }

  return { message: "Please enter a valid txid or hash" }
}
