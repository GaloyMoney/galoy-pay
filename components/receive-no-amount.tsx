import { useMutation } from "@apollo/client"
import { useEffect } from "react"
import Invoice from "./invoice"
import LN_NOAMOUNT_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT from "./ln-noamount-create-on-behalf-of-recipient.gql"

type OperationError = {
  message: string
}

type LnInvoiceObject = {
  paymentRequest: string
}

export default function ReceiveNoAmount({
  recipientWalletId,
  onSetAmountClick,
}: {
  recipientWalletId: string
  onSetAmountClick: () => void
}) {
  const [createInvoice, { loading, error, data }] = useMutation<{
    mutationData: {
      errors: OperationError[]
      invoice?: LnInvoiceObject
    }
  }>(LN_NOAMOUNT_INVOICE_CREATE_ON_BEHALF_OF_RECIPIENT, { onError: console.error })

  useEffect(() => {
    createInvoice({
      variables: { walletId: recipientWalletId },
    })
  }, [createInvoice, recipientWalletId])

  if (error) {
    return <div className="error">{error.message}</div>
  }

  let invoice

  if (data) {
    const invoiceData = data.mutationData

    if (invoiceData.errors?.length > 0) {
      return <div className="error">{invoiceData.errors[0].message}</div>
    }

    invoice = invoiceData.invoice
  }

  return (
    <>
      {loading && <div className="loading">Loading...</div>}

      <button className="set-invoice-button" onClick={onSetAmountClick}>
        Set Invoice Amount
      </button>

      {invoice && <Invoice paymentRequest={invoice.paymentRequest} />}
    </>
  )
}
