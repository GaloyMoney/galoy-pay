"use client"

import { useState } from "react"
import { ApolloError, useLazyQuery } from "@apollo/client"

import Login from "../login"
import { isAuthenticated } from "../../utils"
import Layout from "../layout"

import SearchHeader from "../search-header"
import TransactionList from "./list"
import LnPayment from "./ln-payment"
import LnInvoice from "./ln-invoice"

import { reportError } from "../../utils"
import {
  LIGHTNING_INVOICE,
  LIGHTNING_PAYMENT,
  TRANSACTIONS_BY_HASH,
  TRANSACTION_BY_ID,
} from "../../graphql/queries"
import {
  LightningInvoice,
  LightningPayment,
  TransactionByIdQuery,
  TransactionsByHashQuery,
} from "../../graphql/types"

export type TransactionListType =
  | TransactionsByHashQuery["transactionsByHash"]
  | Array<TransactionByIdQuery["transactionById"]>

const isValidHash = (hash: string) => hash && hash.match(/^[a-f0-9]{64}$/i)
const isValidTxId = (id: string) => id && id.match(/^[0-9a-fA-F]{24}$/i)

function TransactionDetails() {
  const [data, setData] = useState<null | TransactionListType>(null)
  const [payment, setPayment] = useState<null | LightningPayment>(null)
  const [invoice, setInvoice] = useState<null | LightningInvoice>(null)
  const [searchValue, setSearchValue] = useState("")

  const handleTxnsData = (txns: TransactionListType) => {
    setData(txns)
    const txn = txns?.find(
      (txn) =>
        txn?.initiationVia.__typename !== "InitiationViaIntraLedger" &&
        txn?.settlementVia.__typename !== "SettlementViaIntraLedger",
    )

    const paymentHash =
      txn?.initiationVia?.__typename === "InitiationViaLn" &&
      txn?.initiationVia?.paymentHash
    const transactionHash =
      txn?.settlementVia?.__typename === "SettlementViaOnChain" &&
      txn?.settlementVia?.transactionHash

    const hash = paymentHash ?? transactionHash

    if (hash) {
      getLnPayment({ variables: { hash } })
      getLnInvoice({ variables: { hash } })
    }
  }

  const onTxnsError = (error: ApolloError) => {
    reportError(error)
    setData(null)
    setPayment(null)
    setInvoice(null)
  }

  const [getTransactionsByHash, { loading: loadingTransactionsByHash }] = useLazyQuery(
    TRANSACTIONS_BY_HASH,
    {
      onCompleted({ transactionsByHash }) {
        setPayment(null)
        setInvoice(null)

        if (!transactionsByHash) {
          return
        }

        handleTxnsData(transactionsByHash)
      },
      onError: onTxnsError,
      fetchPolicy: "cache-and-network",
    },
  )

  const [getTransactionById, { loading: loadingTransactionById }] = useLazyQuery(
    TRANSACTION_BY_ID,
    {
      onCompleted({ transactionById }) {
        setPayment(null)
        setInvoice(null)

        if (!transactionById) {
          return
        }

        handleTxnsData([transactionById])
      },
      onError: onTxnsError,
      fetchPolicy: "cache-and-network",
    },
  )

  const [getLnPayment, { loading: loadingLnPayment }] = useLazyQuery(LIGHTNING_PAYMENT, {
    onCompleted({ lightningPayment }) {
      setPayment(lightningPayment)
    },
    onError(error) {
      console.warn(error.message)
      setPayment(null)
    },
    fetchPolicy: "cache-and-network",
  })

  const [getLnInvoice, { loading: loadingLnInvoice }] = useLazyQuery(LIGHTNING_INVOICE, {
    onCompleted({ lightningInvoice }) {
      setInvoice(lightningInvoice)
    },
    onError(error) {
      console.warn(error.message)
      setInvoice(null)
    },
    fetchPolicy: "cache-and-network",
  })

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
        {data && <TransactionList transactions={data} loading={loading} />}
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

export default function Transactions() {
  if (!isAuthenticated()) {
    return <Login />
  }

  return (
    <Layout>
      <TransactionDetails />
    </Layout>
  )
}
