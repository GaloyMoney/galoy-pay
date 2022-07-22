import React from "react"

import { useSubscription } from "@apollo/client"

import { OperationError } from "../lib/graphql/index.types.d"
import { LN_INVOICE_PAYMENT_STATUS } from "../lib/graphql/subscription"
import { ACTIONS, ACTIONTYPE } from "../pages/merchant/_reducer"

interface Props {
  paymentRequest: string | undefined
  callbackFn?: () => void
}

const useGetPaymentStatus = ({ paymentRequest, callbackFn }: Props) => {
  const [paymentStatus, setPaymentStatus] = React.useState("not paid")
  const { loading, error, data } = useSubscription<{
    lnInvoicePaymentStatus: {
      errors: OperationError[]
      status?: string
    }
  }>(LN_INVOICE_PAYMENT_STATUS, {
    variables: {
      input: {
        paymentRequest,
      },
    },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.lnInvoicePaymentStatus?.status === "PAID") {
        setPaymentStatus("paid")
        if (callbackFn) callbackFn && callbackFn()
      }
    },
  })

  return {
    loading,
    error,
    data,
    paymentStatus,
  }
}

export default useGetPaymentStatus
