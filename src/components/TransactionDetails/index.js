import React, { useState } from "react"
import { useLazyQuery } from "@apollo/client"
import SearchHeader from "../SearchHeader"
import Transactions from "./Transactions"
import LnPayment from "./LnPayment"
import LnInvoice from "./LnInvoice"
import {
  GET_TRANSACTIONS_BY_HASH,
  GET_TRANSACTION_BY_ID,
  GET_LNPAYMENT_BY_HASH,
  GET_LNINVOICE_BY_HASH,
} from "./queries"
import { reportError } from "../../utils"

const isValidHash = (hash) => hash && hash.match(/^[a-f0-9]{64}$/i)
const isValidTxId = (id) => id && id.match(/^[0-9a-fA-F]{24}$/i)

function TransactionDetails() {
  const [data, setData] = useState(null)
  const [payment, setPayment] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [searchValue, setSearchValue] = useState("")

  const queryOptions = {
    onCompleted({ transactions, transaction }) {
      let txs = transaction ? [transaction] : null
      txs = txs || transactions || []

      setPayment(null)
      setInvoice(null)
      setData(txs)

      const tx = txs.find(
        (t) =>
          t.initiationVia.__typename !== "InitiationViaIntraLedger" &&
          t.settlementVia.__typename !== "SettlementViaIntraLedger",
      )
      const hash =
        tx && (tx.initiationVia.paymentHash || tx.settlementVia.transactionHash)
      if (hash) {
        getLnPayment({ variables: { hash } })
        getLnInvoice({ variables: { hash } })
      }
    },
    onError(error) {
      reportError(error.message)
      setData(null)
      setPayment(null)
      setInvoice(null)
    },
    fetchPolicy: "cache-and-network",
  }

  const [getTransactionsByHash, { loading: loadingTransactionsByHash }] = useLazyQuery(
    GET_TRANSACTIONS_BY_HASH,
    queryOptions,
  )

  const [getTransactionById, { loading: loadingTransactionById }] = useLazyQuery(
    GET_TRANSACTION_BY_ID,
    queryOptions,
  )

  const [getLnPayment, { loading: loadingLnPayment }] = useLazyQuery(
    GET_LNPAYMENT_BY_HASH,
    {
      onCompleted({ payment }) {
        setPayment(payment)
      },
      onError(error) {
        console.warn(error.message)
        setPayment(null)
      },
      fetchPolicy: "cache-and-network",
    },
  )

  const [getLnInvoice, { loading: loadingLnInvoice }] = useLazyQuery(
    GET_LNINVOICE_BY_HASH,
    {
      onCompleted({ invoice }) {
        setInvoice(invoice)
      },
      onError(error) {
        console.warn(error.message)
        setInvoice(null)
      },
      fetchPolicy: "cache-and-network",
    },
  )

  const search = () => {
    setData(null)
    setPayment(null)
    setInvoice(null)

    if (searchValue && isValidHash(searchValue)) {
      return getTransactionsByHash({ variables: { hash: searchValue } })
    }

    if (searchValue && isValidTxId(searchValue)) {
      return getTransactionById({ variables: { id: searchValue } })
    }
  }

  const loading =
    loadingTransactionsByHash ||
    loadingTransactionById ||
    loadingLnPayment ||
    loadingLnInvoice

  return (
    <>
      <SearchHeader
        placeholder="Enter transaction's hash or id"
        value={searchValue}
        onChange={setSearchValue}
        onEnter={search}
      />
      <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">
        Transaction details
        {loading && (
          <small className="animate-pulse font-thin text-sm"> (loading...)</small>
        )}
      </h1>
      <div className="grid gap-6 mb-8 md:grid-cols-1 p-6">
        <Transactions transactions={data} loading={loading} />
        {payment && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Payment</h2>
            <LnPayment payment={payment} loading={loading} />
          </>
        )}
        {invoice && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Invoice</h2>
            <LnInvoice invoice={invoice} loading={loading} />
          </>
        )}
      </div>
    </>
  )
}

export default TransactionDetails
