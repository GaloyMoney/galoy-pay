"use client"

import { useState } from "react"
import { ApolloError } from "@apollo/client"

import Login from "../login"
import { isAuthenticated } from "../../utils"
import Layout from "../layout"

import SearchHeader from "../search-header"
import TransactionList from "./list"
import LnPayment from "./ln-payment"
import LnInvoice from "./ln-invoice"

import { reportError } from "../../utils"
import {
  LightningInvoice,
  LightningPayment,
  TransactionByIdQuery,
  TransactionsByHashQuery,
  useLightningInvoiceLazyQuery,
  useLightningPaymentLazyQuery,
  useTransactionByIdLazyQuery,
  useTransactionsByHashLazyQuery,
} from "../../generated"

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

  const handleTxnsData = (txns: any /* TransactionListType */) => {
    setData(txns)
    const txn = txns?.find(
      (txn: any) =>
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

  const [getTransactionsByHash, { loading: loadingTransactionsByHash }] =
    useTransactionsByHashLazyQuery({
      onCompleted({ transactionsByHash }) {
        setPayment(null)
        setInvoice(null)

        if (!transactionsByHash) {
          return
        }

        handleTxnsData(transactionsByHash)
      },
      onError: onTxnsError,
    })

  const [getTransactionById, { loading: loadingTransactionById }] =
    useTransactionByIdLazyQuery({
      onCompleted({ transactionById }) {
        setPayment(null)
        setInvoice(null)

        if (!transactionById) {
          return
        }

        handleTxnsData([transactionById])
      },
      onError: onTxnsError,
    })

  const [getLnPayment, { loading: loadingLnPayment }] = useLightningPaymentLazyQuery({
    onCompleted({ lightningPayment }) {
      setPayment(lightningPayment)
    },
    onError(error) {
      console.warn(error.message)
      setPayment(null)
    },
  })

  const [getLnInvoice, { loading: loadingLnInvoice }] = useLightningInvoiceLazyQuery({
    onCompleted({ lightningInvoice }) {
      setInvoice(lightningInvoice)
    },
    onError(error) {
      console.warn(error.message)
      setInvoice(null)
    },
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
