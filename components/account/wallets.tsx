"use client"

import { AccountData } from "./"

type Props = {
  accountDetails: AccountData
  update: () => void
  updating: boolean
  loading: boolean
}

const Wallets: React.FC<Props> = ({
  accountDetails,
  update,
  loading = false,
  updating = false,
}) => {
  const usdWalletActive = accountDetails?.wallets?.some((e) => e.walletCurrency === "USD")
  const emptyClass = loading ? "filter blur-sm animate-pulse" : ""

  return (
    <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-4 font-semibold text-gray-600">BTC Wallet</p>
          <p className={`text-gray-600 ${emptyClass}`}>CREATED</p>
        </div>
        <div>
          <p className="mb-4 font-semibold text-gray-600">USD Wallet</p>
          <p className={`text-gray-600 ${emptyClass}`}>
            {usdWalletActive ? (
              <span>CREATED</span>
            ) : (
              <button
                onClick={update}
                disabled={updating}
                className={`text-sm bg-green-500 hover:bg-green-700 text-white font-bold p-2 border border-green-700 rounded disabled:opacity-50`}
              >
                {updating ? "Updating..." : "Add Account"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Wallets
