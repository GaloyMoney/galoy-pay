import React from "react"

import styles from "./paymentoutcome.module.css"

function PaymentOutcome({ state }: React.ComponentState) {
  if (!state.paymentSuccess) console.log("not paid")
  return <div className={styles.container}></div>
}

export default PaymentOutcome
