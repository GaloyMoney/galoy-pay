import React from "react"
import PropTypes from "prop-types"

const defaultData = {
  level: "ONE",
  status: "ACTIVE",
}

function UserUpdate({
  userDetails,
  udpateLevel,
  updateStatus,
  loading = false,
  updatingLevel = false,
  updatingStatus = false,
}) {
  const data = userDetails || defaultData

  let emptyClass = data === defaultData || loading ? "filter blur-sm" : ""
  emptyClass = emptyClass + (loading ? " animate-pulse" : "")

  const isActiveStatus = data.status === "ACTIVE"
  const statusColor = isActiveStatus ? "red" : "green"
  const statusButtonLabel = isActiveStatus ? "Lock" : "Activate"
  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div>
        <p className="mb-4 font-semibold text-gray-600">Level</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data.level}
          {data.level === "ONE" && (
            <button
              onClick={udpateLevel}
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
          {data.status}
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

UserUpdate.propTypes = {
  userDetails: PropTypes.shape({
    level: PropTypes.oneOf(["ONE", "TWO"]),
    status: PropTypes.oneOf(["LOCKED", "ACTIVE"]),
  }),
  udpateLevel: PropTypes.func,
  updatingLevel: PropTypes.bool,
  updateStatus: PropTypes.func,
  updatingStatus: PropTypes.bool,
  loading: PropTypes.bool,
}

export default UserUpdate
