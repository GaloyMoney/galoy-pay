"use client"

import { Account } from "../../generated"
import { formatDate } from "../../utils"

const Details: React.FC<{
  accountDetails: Account
  loading?: boolean
}> = ({ accountDetails, loading = false }) => {
  const data = accountDetails
  const emptyClass = loading ? "filter blur-sm animate-pulse" : ""

  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
      <div>
        <p className="mb-4 font-semibold text-gray-600">Account ID</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data?.uuid}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Phone</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data?.owner?.phone}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Email address</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data?.owner?.email?.address}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Email verified</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {String(data?.owner?.email?.verified)}
        </p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Username</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data?.username || "--"}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Title</p>
        <p className={`text-gray-600 ${emptyClass}`}>{data?.title || "--"}</p>
      </div>
      <div>
        <p className="mb-4 font-semibold text-gray-600">Coordinates</p>
        <p className={`text-gray-600 ${emptyClass}`}>
          {data?.coordinates ? (
            <a
              target="_blank"
              rel="noreferrer"
              className="underline"
              href={`https://maps.google.com/?q=${
                data.coordinates?.latitude + "," + data.coordinates?.longitude
              }`}
            >
              {data.coordinates?.latitude + ", " + data.coordinates?.longitude}
            </a>
          ) : (
            "--"
          )}
        </p>
      </div>
      <div className="col-span-2">
        <p className="mb-4 font-semibold text-gray-600">Created At</p>
        <p className={`text-gray-600 ${emptyClass}`}>{formatDate(data?.createdAt)}</p>
      </div>
    </div>
  )
}

export default Details
