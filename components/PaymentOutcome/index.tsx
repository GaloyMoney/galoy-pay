import { useRouter } from "next/router"
import React from "react"
import Image from "react-bootstrap/Image"

import useGetLNPaymentStatus from "../../hooks/use-Get-LN-Payment-Status"
import useSatPrice from "../../lib/use-sat-price"
import { ACTIONS, ACTION_TYPE } from "../../pages/merchant/_reducer"
import { formatOperand } from "../../utils/utils"
import styles from "./payment-outcome.module.css"

interface Props {
  paymentRequest: string | undefined
  paymentAmount: string | string[] | undefined
  dispatch: React.Dispatch<ACTION_TYPE>
}

function PaymentOutcome({ paymentRequest, paymentAmount, dispatch }: Props) {
  const router = useRouter()
  const { amount, currency } = router.query
  const { usdToSats } = useSatPrice()
  const { data, loading, error } = useGetLNPaymentStatus({
    paymentRequest: paymentRequest,
  })

  if (data !== undefined) {
    if (error) console.error(error)
  }

  const backToCashRegisterButton = (
    <button
      className={styles.back_btn}
      onClick={() => dispatch({ type: ACTIONS.CREATE_NEW_INVOICE })}
    >
      <Image
        src="/icons/cash-register-icon.svg"
        alt="cash register icon"
        width="18"
        height="18"
      />
      Back to cash register
    </button>
  )

  if (data) {
    const { status, errors } = data.lnInvoicePaymentStatus
    if (status === "PAID") {
      return (
        <div className={styles.container}>
          <div aria-labelledby="Payment successful">
            <Image
              src="/icons/success-icon.svg"
              alt="success icon"
              width="104"
              height="104"
            />
            <p className={styles.text}>
              The invoice of{"$"}
              {`${formatOperand(amount?.toString())} (~${
                currency === "USD"
                  ? formatOperand(usdToSats(Number(amount)).toFixed().toString())
                  : paymentAmount
              } sats)`}
              has been paid
            </p>
          </div>
          {backToCashRegisterButton}
          <p className={styles.receipt}>Send receipt</p>
        </div>
      )
    }
    if (errors.length > 0) {
      return (
        <div className={styles.container}>
          <div aria-labelledby="Payment unsuccessful">
            <Image
              src="/icons/cancel-icon.svg"
              alt="success icon"
              width="104"
              height="104"
            />
            <p className={styles.text}>
              Please try again. Either the invoice has expired or it hasn’t been paid.
            </p>
          </div>
          {backToCashRegisterButton}
        </div>
      )
    }
  }
  return <>{loading && null}</>
}

export default PaymentOutcome
