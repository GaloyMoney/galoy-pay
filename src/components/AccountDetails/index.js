import React, { useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import SearchHeader from "../SearchHeader"
import Details from "./Details"
import AccountUpdate from "./AccountUpdate"
import BusinessMapUpdate from "./BusinessMapUpdate"
import {
  GET_ACCOUNT_BY_PHONE,
  GET_ACCOUNT_BY_USERNAME,
  ACCOUNT_UPDATE_STATUS,
  ACCOUNT_UPDATE_LEVEL,
  BUSINESS_UPDATE_MAP_INFO,
} from "./queries"
import { validPhone, validUsername, reportError } from "../../utils"

function AccountDetails() {
  const [data, setData] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const onError = (error) => {
    reportError(error?.graphQLErrors?.[0]?.code + ": " + error.message)
  }

  const queryOptions = {
    onCompleted(data) {
      if (data?.accountDetails) {
        setData(data?.accountDetails)
      }
    },
    onError,
    fetchPolicy: "no-cache",
  }

  const [getAccountByUserPhone, { loading: loadingAccountByPhone }] = useLazyQuery(
    GET_ACCOUNT_BY_PHONE,
    queryOptions,
  )

  const [getAccountByUsername, { loading: loadingAccountByUsername }] = useLazyQuery(
    GET_ACCOUNT_BY_USERNAME,
    queryOptions,
  )

  const [updateAccountStatus, { loading: loadingAccountStatus }] = useMutation(
    ACCOUNT_UPDATE_STATUS,
    {
      onCompleted({ mutationData }) {
        setData(mutationData.accountDetails)
        alert(
          `${data.username || data.phone}'s account status has been changed successfully`,
        )
      },
      onError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateAccountLevel, { loading: loadingAccountLevel }] = useMutation(
    ACCOUNT_UPDATE_LEVEL,
    {
      onCompleted({ mutationData }) {
        setData(mutationData.accountDetails)
        alert(
          `${data.username || data.phone}'s account level has been changed successfully`,
        )
      },
      onError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateBusinessMap, { loading: loadingBusinessMap }] = useMutation(
    BUSINESS_UPDATE_MAP_INFO,
    {
      onCompleted({ mutationData }) {
        setData(mutationData.accountDetails)
        alert(
          `${
            data.username || data.phone
          }'s business map info has been changed successfully`,
        )
      },
      onError,
      fetchPolicy: "no-cache",
    },
  )

  const loading = loadingAccountByPhone || loadingAccountByUsername

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
    updateAccountLevel({ variables: { input: { uid: data.id, level: "TWO" } } })
  }

  const changeAccountStatus = () => {
    const targetStatus = data.status === "ACTIVE" ? "LOCKED" : "ACTIVE"
    const confirmation = window.confirm(
      `Clicking OK will change ${data.phone}'s status to ${targetStatus}. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateAccountStatus({
        variables: { input: { uid: data.id, status: targetStatus } },
      })
    }
  }

  const changeBusinessMapDetails = (businessInfo) => {
    const input = { username: data.username, ...businessInfo }
    if (data.username) {
      return updateBusinessMap({ variables: { input } })
    }
    alert("Username is required")
  }

  return (
    <>
      <SearchHeader
        placeholder="Enter user's phone number or user name"
        value={searchValue}
        onChange={setSearchValue}
        onEnter={search}
      />
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
            udpateLevel={data && changeLevel}
            updatingLevel={loadingAccountLevel}
            updateStatus={data && changeAccountStatus}
            updatingStatus={loadingAccountStatus}
            loading={loading}
          />
          <BusinessMapUpdate
            accountDetails={data?.username && data}
            udpate={data && changeBusinessMapDetails}
            updating={loadingBusinessMap}
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default AccountDetails
