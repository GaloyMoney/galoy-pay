import React, { useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import SearchHeader from "../SearchHeader"
import Details from "./Details"
import UserUpdate from "./UserUpdate"
import BusinessMapUpdate from "./BusinessMapUpdate"
import {
  GET_USER_BY_PHONE,
  GET_USER_BY_USERNAME,
  USER_UPDATE_STATUS,
  USER_UPDATE_LEVEL,
  BUSINESS_UPDATE_MAP_INFO,
} from "./queries"
import { validPhone, validUsername, reportError } from "../../utils"

function UserDetails() {
  const [data, setData] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const onError = (error) => {
    reportError(error.message)
    setData(null)
  }

  const queryOptions = {
    onCompleted({ userDetails }) {
      setData(userDetails)
    },
    onError,
    fetchPolicy: "no-cache",
  }

  const [getUserByPhone, { loading: loadingUserByPhone }] = useLazyQuery(
    GET_USER_BY_PHONE,
    queryOptions,
  )

  const [getUserByUsername, { loading: loadingUserByUsername }] = useLazyQuery(
    GET_USER_BY_USERNAME,
    queryOptions,
  )

  const [updateUserStatus, { loading: loadingUserStatus }] = useMutation(
    USER_UPDATE_STATUS,
    {
      onCompleted({ mutationData }) {
        setData(mutationData.userDetails)
        alert(
          `${data.username || data.phone}'s account status has been changed successfully`,
        )
      },
      onError,
      fetchPolicy: "no-cache",
    },
  )

  const [updateUserLevel, { loading: loadingUserLevel }] = useMutation(
    USER_UPDATE_LEVEL,
    {
      onCompleted({ mutationData }) {
        setData(mutationData.userDetails)
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
        setData(mutationData.userDetails)
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

  const loading = loadingUserByPhone || loadingUserByUsername

  const search = () => {
    if (searchValue && validPhone(searchValue)) {
      return getUserByPhone({ variables: { phone: searchValue } })
    }

    if (searchValue && validUsername(searchValue)) {
      return getUserByUsername({ variables: { username: searchValue } })
    }
  }

  const changeLevel = () => {
    updateUserLevel({ variables: { input: { uid: data.id, level: "TWO" } } })
  }

  const changeAccountStatus = () => {
    const targetStatus = data.status === "ACTIVE" ? "LOCKED" : "ACTIVE"
    const confirmation = window.confirm(
      `Clicking OK will change ${data.phone}'s status to ${targetStatus}. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateUserStatus({
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
        User details
        {loading && (
          <small className="animate-pulse font-thin text-sm"> (loading...)</small>
        )}
      </h1>
      <div className="grid gap-6 mb-8 md:grid-cols-2 p-6">
        <Details userDetails={data} loading={loading} />
        <div className="grid grid-cols-1 gap-4">
          <UserUpdate
            userDetails={data}
            udpateLevel={data && changeLevel}
            updatingLevel={loadingUserLevel}
            updateStatus={data && changeAccountStatus}
            updatingStatus={loadingUserStatus}
            loading={loading}
          />
          <BusinessMapUpdate
            userDetails={data?.username && data}
            udpate={data && changeBusinessMapDetails}
            updating={loadingBusinessMap}
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default UserDetails
