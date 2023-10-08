import {
  LightningInvoice,
  LightningInvoiceDocument,
  LightningInvoiceQuery,
  LightningPayment,
  LightningPaymentDocument,
  LightningPaymentQuery,
  TransactionsByHashDocument,
  TransactionsByHashQuery,
} from "../../../../generated"

import TransactionList from "../../../../components/transactions/list"
import { getClient } from "../../../graphql-rsc"
import LnInvoice from "../../../../components/transactions/ln-invoice"
import LnPayment from "../../../../components/transactions/ln-payment"

export default async function TransactionDetails({ params }: { params: { id: string } }) {
  const id = params.id

  let txs: any

  try {
    const data = await getClient().query<TransactionsByHashQuery>({
      query: TransactionsByHashDocument,
      variables: { hash: id },
    })

    txs = data.data.transactionsByHash
  } catch (err) {
    // ignore
    // no transactions attached to this hash
    console.log(err)
  }

  let invoice: LightningInvoice | undefined

  try {
    const data = await getClient().query<LightningInvoiceQuery>({
      query: LightningInvoiceDocument,
      variables: { hash: id },
    })

    invoice = data.data.lightningInvoice
  } catch (err) {
    // ignore
    // no invoice attached to this hash
    console.log(err)
  }

  let payment: LightningPayment | undefined

  try {
    const data = await getClient().query<LightningPaymentQuery>({
      query: LightningPaymentDocument,
      variables: { hash: id },
    })

    payment = data.data?.lightningPayment
  } catch (err) {
    // ignore
    // no payment attached to this hash
    console.log(err)
  }

  return (
    <>
      {txs && (
        <>
          <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">
            Transaction details
          </h1>
          <div className="grid gap-6 mb-8 md:grid-cols-1 p-6">
            <TransactionList transactions={txs} />
          </div>
        </>
      )}
      {invoice && (
        <>
          <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">Invoice</h1>
          <div className="grid gap-6 mb-8 md:grid-cols-1 p-6">
            <LnInvoice invoice={invoice} />
          </div>
        </>
      )}
      {payment && (
        <>
          <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">Payment</h1>
          <div className="grid gap-6 mb-8 md:grid-cols-1 p-6">
            <LnPayment payment={payment} />
          </div>
        </>
      )}
    </>
  )
}
