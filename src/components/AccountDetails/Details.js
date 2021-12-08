import React from "react"
import PropTypes from "prop-types"
import { formatDate } from "../../utils"

const defaultData = {
  owner: {
    phone: "+11111111111",
  },
  username: "username",
  level: "ONE",
  status: "ACTIVE",
  title: "title",
  coordinates: {
    latitude: "13.4972747",
    longitude: "-89.4435569",
  },
  createdAt: 1633992340,
}

function Details({ accountDetails, loading = false }) {
  const data = accountDetails || defaultData
  let emptyClass = data === defaultData || loading ? "filter blur-sm" : ""
  emptyClass = emptyClass + (loading ? " animate-pulse" : "")

  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div>
        <p className="mb-4 font-semibold text-gray-600">Phone</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data.owner.phone}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Username</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data.username || "--"}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Title</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data.title || "--"}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Coordinates</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data.coordinates ? (
            <a
              target="_blank"
              rel="noreferrer"
              className="underline"
              href={`https://maps.google.com/?q=${
                data.coordinates.latitude + "," + data.coordinates.longitude
              }`}
            >
              {data.coordinates.latitude + ", " + data.coordinates.longitude}
            </a>
          ) : (
            "--"
          )}
        </p>
      </div>
      <div className="col-span-2">
        <p className="mb-4 font-semibold text-gray-600">Created At</p>
        <p className={`text-gray-600 ${emptyClass}`}>{formatDate(data.createdAt)}</p>
      </div>
    </div>
  )
}

Details.propTypes = {
  accountDetails: PropTypes.object,
  loading: PropTypes.bool,
}

export default Details
