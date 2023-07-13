"use client"

import { useState } from "react"

import Login from "../login"
import { isAuthenticated, validEmail } from "../../utils"
import Layout from "../layout"

import SearchHeader from "../search-header"
import Details from "./details"
import AccountUpdate from "./update"
import BusinessMapUpdate from "./business-map-update"
import { validPhone, validUsername, reportError } from "../../utils"

import {
  Account,
  AccountLevel,
  AccountStatus,
  Coordinates,
  useAccountDetailsByEmailLazyQuery,
  useAccountDetailsByUserPhoneLazyQuery,
  useAccountDetailsByUsernameLazyQuery,
  useAccountUpdateLevelMutation,
  useAccountUpdateStatusMutation,
  useBusinessDeleteMapInfoMutation,
  useBusinessUpdateMapInfoMutation,
} from "../../generated"

export type AccountBusinessInfo = {
  title: string
  coordinates: Omit<Coordinates, "__typename">
}

function AccountDetails() {
  const [data, setData] = useState<null | Account>(null)
  const [searchValue, setSearchValue] = useState("")

  const [updateAccountStatus, { loading: loadingAccountStatus }] =
    useAccountUpdateStatusMutation({
      onCompleted({ accountUpdateStatus }) {
        if (accountUpdateStatus.accountDetails) {
          setData(accountUpdateStatus.accountDetails)
          const usernameOrPhone =
            accountUpdateStatus.accountDetails.username ??
            accountUpdateStatus.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s account status has been changed successfully`)
        }
      },
      onError: reportError,
    })

  const [updateAccountLevel, { loading: loadingAccountLevel }] =
    useAccountUpdateLevelMutation({
      onCompleted({ accountUpdateLevel }) {
        if (accountUpdateLevel.accountDetails) {
          setData(accountUpdateLevel.accountDetails)
          const usernameOrPhone =
            accountUpdateLevel.accountDetails.username ??
            accountUpdateLevel.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s account level has been changed successfully`)
        }
      },
      onError: reportError,
    })

  const [updateBusinessMap, { loading: loadingBusinessMap }] =
    useBusinessUpdateMapInfoMutation({
      onCompleted({ businessUpdateMapInfo }) {
        if (businessUpdateMapInfo.accountDetails) {
          setData(businessUpdateMapInfo.accountDetails)
          const usernameOrPhone =
            businessUpdateMapInfo.accountDetails.username ??
            businessUpdateMapInfo.accountDetails.owner.phone
          alert(`${usernameOrPhone}'s business map info has been changed successfully`)
        }
      },
      onError: reportError,
    })

  const [deleteBusiness] = useBusinessDeleteMapInfoMutation({
    onError: reportError,
  })

  const [getAccountByUsername, { loading: loadingAccountByUsername }] =
    useAccountDetailsByUsernameLazyQuery({
      onCompleted(data) {
        if (data.accountDetailsByUsername) {
          setData(data.accountDetailsByUsername)
        }
      },
      onError: reportError,
    })

  const [getAccountDetailsByUserPhone, { loading: loadingAccountByPhone }] =
    useAccountDetailsByUserPhoneLazyQuery({
      onCompleted(data) {
        if (data.accountDetailsByUserPhone) {
          data.accountDetailsByUserPhone

          setData(data.accountDetailsByUserPhone)
        }
      },
      onError: reportError,
    })

  const [getAccountDetailsByEmail, { loading: loadingAccountByEmail }] =
    useAccountDetailsByEmailLazyQuery({
      onCompleted(data) {
        if (data.accountDetailsByEmail) {
          data.accountDetailsByEmail

          setData(data.accountDetailsByEmail)
        }
      },
      onError: reportError,
    })

  const loading =
    loadingAccountByPhone || loadingAccountByUsername || loadingAccountByEmail

  const usernameOrPhone = data?.username ?? data?.owner.phone

  const search = () => {
    if (searchValue && validPhone(searchValue)) {
      return getAccountDetailsByUserPhone({ variables: { phone: searchValue } })
    }
    if (searchValue && validUsername(searchValue)) {
      return getAccountByUsername({ variables: { username: searchValue } })
    }
    if (searchValue && validEmail(searchValue)) {
      return getAccountDetailsByEmail({ variables: { email: searchValue } })
    }
    // invalid search
    alert("Please enter a full phone number, username or email")
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

  const changeBusinessMapDetails = ({ title, coordinates }: AccountBusinessInfo) => {
    if (!data) {
      return
    }
    if (data.username) {
      const input = { username: data.username, title, ...coordinates }
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
