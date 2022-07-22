import React from "react"

import { useSubscription } from "@apollo/client"

import { OperationError } from "../lib/graphql/index.types.d"
import { LN_INVOICE_PAYMENT_STATUS } from "../lib/graphql/subscription"
import { ACTIONS, ACTIONTYPE } from "../pages/merchant/_reducer"

interface Props {
  paymentRequest: string
  callbackFn?: () => void
  dispatch?: React.Dispatch<ACTIONTYPE>
}

const useGetPaymentStatus = ({ paymentRequest, callbackFn, dispatch }: Props) => {
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
        if (!callbackFn) return
        callbackFn && callbackFn()
      }
    },
  })
  if (data) {
    const { status } = data.lnInvoicePaymentStatus
    if (dispatch) {
      if (status === "PAID") {
        dispatch({ type: ACTIONS.GET_PAYMENT_STATUS, payload: "PAID" })
      }
      if (status === undefined || status === "UNPAID") {
        dispatch({ type: ACTIONS.GET_PAYMENT_STATUS, payload: "UNPAID" })
      }
    }
  }
  return {
    loading,
    error,
    data,
  }
}

export default useGetPaymentStatus
