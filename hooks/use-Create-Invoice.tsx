import { useState } from "react"

import { gql } from "@apollo/client"
import {
  useLnInvoiceCreateOnBehalfOfRecipientsMutation,
  useLnUsdInvoiceCreateOnBehalfOfRecipientMutation,
} from "../lib/graphql/generated"

interface Props {
  recipientWalletCurrency: string | undefined
}

gql`
  mutation lnUsdInvoiceCreateOnBehalfOfRecipient(
    $input: LnUsdInvoiceCreateOnBehalfOfRecipientInput!
  ) {
    lnUsdInvoiceCreateOnBehalfOfRecipient(input: $input) {
      errors {
        __typename
        message
      }
      invoice {
        __typename
        paymentHash
        paymentRequest
        paymentSecret
        satoshis
      }
      __typename
    }
  }
`

gql`
  mutation lnInvoiceCreateOnBehalfOfRecipients(
    $input: LnInvoiceCreateOnBehalfOfRecipientInput!
  ) {
    lnInvoiceCreateOnBehalfOfRecipient(input: $input) {
      errors {
        __typename
        message
      }
      invoice {
        __typename
        paymentHash
        paymentRequest
        paymentSecret
        satoshis
      }
      __typename
    }
  }
`
const useCreateInvoice = ({ recipientWalletCurrency }: Props) => {
  const [invoiceStatus, setInvoiceStatus] = useState<
    "loading" | "new" | "need-update" | "expired"
  >("loading")

  const mutation =
    recipientWalletCurrency === "USD"
      ? useLnUsdInvoiceCreateOnBehalfOfRecipientMutation
      : useLnInvoiceCreateOnBehalfOfRecipientsMutation

  const [createInvoice, { loading, error, data }] = mutation({
    onError: console.error,
    onCompleted: () => setInvoiceStatus("new"),
  })

  return {
    createInvoice,
    setInvoiceStatus,
    invoiceStatus,
    loading,
    errorsMessage: error?.message,
    error,
    data,
  }
}

export default useCreateInvoice
