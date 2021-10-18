import React from "react"
import PropTypes from "prop-types"
import { formatDate, formatNumber } from "../../utils"

function Transactions({ transactions, loading = false }) {
  const hasData = transactions && transactions.length > 0
  const isInternalTx = hasData && transactions[0].settlementVia === "INTRA_LEDGER"
  return (
    <div className="shadow w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th className="px-4 py-3">id</th>
              <th className="px-4 py-3">Initiation</th>
              <th className="px-4 py-3">Settlement</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Direction</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Memo</th>
              <th className="px-4 py-3">{isInternalTx ? "Other Party" : "Hash"}</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {hasData &&
              transactions.map((tx) => (
                <tr key={tx.id} className="text-gray-700 dark:text-gray-400">
                  <td className="px-4 py-3">{tx.id}</td>
                  <td className="px-4 py-3">{tx.initiationVia}</td>
                  <td className="px-4 py-3">{tx.settlementVia}</td>
                  <td className="px-4 py-3">{formatNumber(tx.settlementAmount)}</td>
                  <td className="px-4 py-3">{formatNumber(tx.settlementFee)}</td>
                  <td className="px-4 py-3">
                    {formatNumber(tx.settlementPrice.formattedAmount)}
                  </td>
                  <td className="px-4 py-3">{tx.direction}</td>
                  <td className="px-4 py-3">{tx.status}</td>
                  <td className="px-4 py-3 break-all">{tx.memo}</td>
                  <td className="px-4 py-3 break-all">
                    {tx.transactionHash ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                        href={`https://mempool.space/tx/${tx.transactionHash}`}
                      >
                        {tx.transactionHash}
                      </a>
                    ) : (
                      tx.paymentHash || tx.otherPartyUsername || "--"
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            {!hasData && (
              <tr className="text-gray-700 dark:text-gray-400">
                <td colSpan="11" className="px-4 py-3 text-center">
                  {loading ? "Loading..." : "No data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Transactions.propTypes = {
  transactions: PropTypes.array,
  loading: PropTypes.bool,
}

export default Transactions
