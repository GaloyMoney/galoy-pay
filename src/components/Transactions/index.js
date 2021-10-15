import React, { useState } from "react"
import { useLazyQuery } from "@apollo/client"
import SearchHeader from "../SearchHeader"
import LnPayment from "./LnPayment"
import LnInvoice from "./LnInvoice"
import { GET_LNPAYMENT_BY_HASH, GET_LNINVOICE_BY_HASH } from "./queries"

function Transactions() {
  const [
    getLnPayment,
    { loading: loadingLnPayment, error: errorLnPayment, data: lnPayment },
  ] = useLazyQuery(GET_LNPAYMENT_BY_HASH, { fetchPolicy: "cache-and-network" })

  const [
    getLnInvoice,
    { loading: loadingLnInvoice, error: errorLnInvoice, data: lnInvoice },
  ] = useLazyQuery(GET_LNINVOICE_BY_HASH, { fetchPolicy: "cache-and-network" })

  const [searchValue, setSearchValue] = useState("")

  const search = () => {
    getLnPayment({ variables: { hash: searchValue } })
    getLnInvoice({ variables: { hash: searchValue } })
  }

  const showLnInvoice = lnInvoice && lnInvoice.invoice
  const showLnPayment = !showLnInvoice || (lnPayment && lnPayment.payment)

  return (
    <div>
      <SearchHeader
        placeholder="Enter transaction's hash or id"
        value={searchValue}
        onChange={setSearchValue}
        onEnter={search}
      />
      <div className="grid gap-6 mb-8 md:grid-cols-2 p-6">
        {errorLnPayment && errorLnPayment.message}
        {errorLnInvoice && errorLnInvoice.message}
        {showLnPayment && (
          <LnPayment
            payment={lnPayment && lnPayment.payment}
            loading={loadingLnPayment || loadingLnInvoice}
          />
        )}
        {showLnInvoice && (
          <LnInvoice
            invoice={lnInvoice && lnInvoice.invoice}
            loading={loadingLnPayment || loadingLnInvoice}
          />
        )}
      </div>
    </div>
  )
}

export default Transactions
