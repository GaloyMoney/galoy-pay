"use client"

import { useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"

import Login from "../login"
import { isAuthenticated } from "../../utils"
import Layout from "../layout"

import SearchHeader from "../search-header"
import Details from "./details"
import AccountUpdate from "./update"
import Wallets from "./wallets"
import BusinessMapUpdate from "./business-map-update"
import { validPhone, validUsername, reportError } from "../../utils"
import {
  ACCOUNT_DETAILS_BY_USERNAME,
  ACCOUNT_DETAILS_BY_USER_PHONE,
} from "../../graphql/queries"
import {
  ACCOUNT_UPDATE_STATUS,
  ACCOUNTS_ADD_USD_WALLET,
  ACCOUNT_UPDATE_LEVEL,
  BUSINESS_UPDATE_MAP_INFO,
  BUSINESS_DELETE_MAP,
} from "../../graphql/mutations"
import { AccountLevel, AccountStatus, WalletCurrency } from "../../graphql/types"

// FIXME: using this type from the schema was not working
// because the `data` state is shared among multiple operations
export type AccountData = {
  __typename?: "Account"
  id: string
  username?: string | null
  level: AccountLevel
  status: AccountStatus
  title?: string | null
  createdAt: number
  owner: { __typename?: "User"; id: string; language: string; phone: string }
  coordinates?: {
    __typename?: "Coordinates"
    latitude: number
    longitude: number
  } | null
  wallets?: Array<
    | { __typename?: "BTCWallet"; id: string; walletCurrency: WalletCurrency }
    | { __typename?: "UsdWallet"; id: string; walletCurrency: WalletCurrency }
  >
}

export type AccountBusinessInfo = {
  title: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

function AccountDetails() {
  const [data, setData] = useState<null | AccountData>(null)
  const [searchValue, setSearchValue] = useState("")

  const updateData = (newData: AccountData) => {
    setData((currData) => ({ ...currData, ...newData }))
  }

  const [getAccountByUserPhone, { loading: loadingAccountByPhone }] = useLazyQuery(
    ACCOUNT_DETAILS_BY_USER_PHONE,
    {
      onCompleted(data) {
        if (data.accountDetailsByUserPhone) {
          updateData(data.accountDetailsByUserPhone)
        }
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [getAccountByUsername, { loading: loadingAccountByUsername }] = useLazyQuery(
    ACCOUNT_DETAILS_BY_USERNAME,
    {
      onCompleted(data) {
        if (data.accountDetailsByUsername) {
          updateData(data.accountDetailsByUsername)
        }
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateAccountStatus, { loading: loadingAccountStatus }] = useMutation(
    ACCOUNT_UPDATE_STATUS,
    {
      onCompleted({ accountUpdateStatus }) {
        if (accountUpdateStatus.accountDetails) {
          updateData(accountUpdateStatus.accountDetails)
          const usernameOrPhone =
            accountUpdateStatus.accountDetails.username ??
            accountUpdateStatus.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s account status has been changed successfully`)
        }
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateUsdWallet, { loading: loadingUsdStatus }] = useMutation(
    ACCOUNTS_ADD_USD_WALLET,
    {
      onCompleted() {
        alert(`USD wallet activated successfully`)
        // refresh the data via search
        search()
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateAccountLevel, { loading: loadingAccountLevel }] = useMutation(
    ACCOUNT_UPDATE_LEVEL,
    {
      onCompleted({ accountUpdateLevel }) {
        if (accountUpdateLevel.accountDetails) {
          updateData(accountUpdateLevel.accountDetails)
          const usernameOrPhone =
            accountUpdateLevel.accountDetails.username ??
            accountUpdateLevel.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s account level has been changed successfully`)
        }
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateBusinessMap, { loading: loadingBusinessMap }] = useMutation(
    BUSINESS_UPDATE_MAP_INFO,
    {
      onCompleted({ businessUpdateMapInfo }) {
        if (businessUpdateMapInfo.accountDetails) {
          updateData(businessUpdateMapInfo.accountDetails)
          const usernameOrPhone =
            businessUpdateMapInfo.accountDetails.username ??
            businessUpdateMapInfo.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s business map info has been changed successfully`)
        }
      },
      onError: reportError,
      fetchPolicy: "no-cache",
    },
  )

  const [deleteBusiness] = useMutation(BUSINESS_DELETE_MAP, {
    onCompleted({ businessDeleteMapInfo }) {
      if (businessDeleteMapInfo.accountDetails) {
        updateData(businessDeleteMapInfo.accountDetails)
        const usernameOrPhone =
          businessDeleteMapInfo.accountDetails.username ??
          businessDeleteMapInfo.accountDetails.owner.phone
        alert(`${usernameOrPhone}'s business has been deleted successfully from map`)
      }
    },
    onError: reportError,
    fetchPolicy: "no-cache",
  })

  const loading = loadingAccountByPhone || loadingAccountByUsername

  const usernameOrPhone = data?.username ?? data?.owner.phone

  const search = () => {
    if (searchValue && validPhone(searchValue)) {
      return getAccountByUserPhone({ variables: { phone: searchValue } })
    }
    if (searchValue && validUsername(searchValue)) {
      return getAccountByUsername({ variables: { username: searchValue } })
    }
    // invalid search
    alert("Please enter a full phone number or username")
  }

  const changeLevel = () => {
    if (!data) {
      return
    }
    updateAccountLevel({
      variables: { input: { uid: data.id, level: AccountLevel.Two } },
    })
  }

  const changeAccountStatus = () => {
    if (!data) {
      return
    }
    const targetStatus =
      data.status === "ACTIVE" ? AccountStatus.Locked : AccountStatus.Active
    const confirmation = window.confirm(
      `Clicking OK will change ${usernameOrPhone}'s status to ${targetStatus}. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateAccountStatus({
        variables: { input: { uid: data.id, status: targetStatus } },
      })
    }
  }

  const addUsdWallet = () => {
    if (!data) {
      return
    }
    const confirmation = window.confirm(
      `Clicking OK will add a USD wallet to ${usernameOrPhone}'s account. This action cannot be reversed. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateUsdWallet({
        variables: { input: { accountIds: [data.id] } },
      })
    }
  }

  const changeBusinessMapDetails = ({ title, coordinates }: AccountBusinessInfo) => {
    if (!data) {
      return
    }
    const input = { username: data.username, title, ...coordinates }
    if (data.username) {
      return updateBusinessMap({ variables: { input } })
    }
    alert("Username is required")
  }

  const deleteBusinessDetails = (username: string) => {
    if (!username) {
      return
    }
    const input = { username }
    return deleteBusiness({ variables: { input } })
  }

  return (
    <>
      <SearchHeader
        placeholder="Enter user's phone number or user name"
        value={searchValue}
        onChange={setSearchValue}
        onEnter={search}
      />
      {data && (
        <>
          <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">
            Account details
            {loading && (
              <small className="animate-pulse font-thin text-sm"> (loading...)</small>
            )}
          </h1>
          <div className="grid gap-6 mb-8 md:grid-cols-2 p-6">
            <Details accountDetails={data} loading={loading} />
            <div className="grid grid-cols-1 gap-4">
              <AccountUpdate
                accountDetails={data}
                updateLevel={changeLevel}
                updatingLevel={loadingAccountLevel}
                updateStatus={changeAccountStatus}
                updatingStatus={loadingAccountStatus}
                loading={loading}
              />
              <Wallets
                accountDetails={data}
                update={addUsdWallet}
                updating={loadingUsdStatus}
                loading={loading}
              />
              <BusinessMapUpdate
                accountDetails={data}
                update={changeBusinessMapDetails}
                deleteBusiness={deleteBusinessDetails}
                updating={loadingBusinessMap}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default function Account() {
  if (!isAuthenticated()) {
    return <Login />
  }

  return (
    <Layout>
      <AccountDetails />
    </Layout>
  )
}
