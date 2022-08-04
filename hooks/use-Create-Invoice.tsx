import { useState } from "react"

import { useMutation } from "@apollo/client"

import { LnInvoiceObject, OperationError } from "../lib/graphql/index.types.d"
import {
  LN_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT,
  LN_USD_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT,
} from "../lib/graphql/mutations"

interface Props {
  recipientWalletCurrency: string | undefined
}

const useCreateInvoice = ({ recipientWalletCurrency }: Props) => {
  const [invoiceStatus, setInvoiceStatus] = useState<
    "loading" | "new" | "need-update" | "expired"
  >("loading")

  const INVOICE_CREATION_MUTATION =
    recipientWalletCurrency === "USD"
      ? LN_USD_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT
      : LN_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT

  const [createInvoice, { loading, error, data }] = useMutation<{
    mutationData: {
      errors: OperationError[]
      invoice?: LnInvoiceObject
    }
  }>(INVOICE_CREATION_MUTATION, {
    onError: console.error,
    onCompleted: () => setInvoiceStatus("new"),
  })
  return {
    createInvoice,
    setInvoiceStatus,
    invoiceStatus,
    loading,
    error,
    data,
  }
}

export default useCreateInvoice
