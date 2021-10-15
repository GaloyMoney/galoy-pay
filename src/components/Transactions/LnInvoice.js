import React from "react"
import PropTypes from "prop-types"

const emptyInvoice = {
  createdAt: 0,
  confirmedAt: 0,
  description: "----------------------------------------------------------------",
  expiresAt: 0,
  isSettled: false,
  received: 0,
  request: "lnbc1000000000000000000000000000000000000000000000000000000000000",
  secret: "0000000000000000000000000000000000000000000000000000000000000000",
}

function LnInvoice({ invoice, loading = false }) {
  const data = invoice || emptyInvoice
  let emptyClass = data === emptyInvoice || loading ? "filter blur-sm" : ""
  emptyClass = emptyClass + (loading ? " animate-pulse" : "")

  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Settled</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data.isSettled ? "Yes" : "No"}</p>
      </div>
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Created At</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {new Date(data.createdAt * 1e3).toLocaleString()}
        </p>
      </div>
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Amount</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data.received || 0}</p>
      </div>
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Memo</p>
        <p className={`text-gray-600 break-all ${emptyClass}`}>
          {data.description || "--"}
        </p>
      </div>
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Confirmed At</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data.confirmedAt ? new Date(data.confirmedAt * 1e3).toLocaleString() : "--"}
        </p>
      </div>
      <div className="">
        <p className="mb-4 font-semibold text-gray-600">Expires At</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data.expiresAt ? new Date(data.expiresAt * 1e3).toLocaleString() : "--"}
        </p>
      </div>
      <div className="col-span-2">
        <p className="mb-4 font-semibold text-gray-600">Secret</p>
        <p className={`text-gray-600 break-all ${emptyClass}`}>{data.secret}</p>
      </div>
      <div className="col-span-2">
        <p className="mb-4 font-semibold text-gray-600">Request</p>
        <p className={`text-gray-600 break-all ${emptyClass}`}>{data.request || "--"}</p>
      </div>
    </div>
  )
}

LnInvoice.propTypes = {
  invoice: PropTypes.object,
  loading: PropTypes.bool,
}

export default LnInvoice
