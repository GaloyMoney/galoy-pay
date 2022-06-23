import React from "react"
import PropTypes from "prop-types"

function AccountUpdate({
  accountDetails,
  updateLevel,
  updateStatus,
  loading = false,
  updatingLevel = false,
  updatingStatus = false,
}) {
  const data = accountDetails

  let emptyClass = loading ? "filter blur-sm animate-pulse" : ""

  const isActiveStatus = data?.status === "ACTIVE"
  const statusColor = isActiveStatus ? "red" : "green"
  const statusButtonLabel = isActiveStatus ? "Lock" : "Activate"
  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div>
        <p className="mb-4 font-semibold text-gray-600">Level</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data?.level}
          {data?.level === "ONE" && (
            <button
              onClick={updateLevel}
              className="text-sm mx-4 bg-green-500 hover:bg-green-700 text-white font-bold p-2 border border-green-700 rounded disabled:opacity-50"
            >
              {updatingLevel ? "Updating..." : "Upgrade"}
            </button>
          )}
        </p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Status</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data?.status}
          <button
            onClick={updateStatus}
            disabled={updatingStatus}
            className={`text-sm mx-4 bg-${statusColor}-500 hover:bg-${statusColor}-700 text-white font-bold p-2 border border-${statusColor}-700 rounded disabled:opacity-50`}
          >
            {updatingStatus ? "Updating..." : statusButtonLabel}
          </button>
        </p>
      </div>
    </div>
  )
}

AccountUpdate.propTypes = {
  accountDetails: PropTypes.shape({
    level: PropTypes.oneOf(["ONE", "TWO"]),
    status: PropTypes.oneOf(["LOCKED", "ACTIVE"]),
  }),
  updateLevel: PropTypes.func,
  updatingLevel: PropTypes.bool,
  updateStatus: PropTypes.func,
  updatingStatus: PropTypes.bool,
  loading: PropTypes.bool,
}

export default AccountUpdate
