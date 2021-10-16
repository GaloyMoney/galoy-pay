import React, { useState } from "react"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { validPhone, validUsername, reportError, formatDate } from "../utils"
import SearchHeader from "./SearchHeader"
import AddToMap from "./AddToMap"

// TODO: use fragment for userDetails

const GET_USER_BY_PHONE = gql`
  query getUserDetails($phone: Phone!) {
    userDetails: userDetailsByPhone(phone: $phone) {
      id
      phone
      username
      level
      status
      title
      coordinates {
        latitude
        longitude
      }
      createdAt
    }
  }
`

const GET_USER_BY_USERNAME = gql`
  query getUserDetails($username: Username!) {
    userDetails: userDetailsByUsername(username: $username) {
      id
      phone
      username
      level
      status
      title
      coordinates {
        latitude
        longitude
      }
      createdAt
    }
  }
`

const USER_UPDATE_STATUS = gql`
  mutation userUpdateStatus($input: UserUpdateStatusInput!) {
    mutationData: userUpdateStatus(input: $input) {
      errors {
        message
      }
      userDetails {
        id
        phone
        username
        level
        status
        title
        coordinates {
          latitude
          longitude
        }
        createdAt
      }
    }
  }
`

const USER_UPDATE_LEVEL = gql`
  mutation userUpdateLevel($input: UserUpdateLevelInput!) {
    mutationData: userUpdateLevel(input: $input) {
      errors {
        message
      }
      userDetails {
        id
        phone
        username
        level
        status
        title
        coordinates {
          latitude
          longitude
        }
        createdAt
      }
    }
  }
`

const emptyUserDetails = {
  phone: "+11111111111",
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

// TODO: Split into 3 components
function UserDetails() {
  const [userDetails, setUserDetails] = React.useState("")

  // TODO: get rid of onCompleted and use hooks data directly

  const [getUserByPhone, { loading: gettingUserByPhone }] = useLazyQuery(
    GET_USER_BY_PHONE,
    {
      onCompleted({ userDetails }) {
        setUserDetails(userDetails)
      },
      onError(error) {
        reportError(error.message)
        setSearchValue("")
        setUserDetails(emptyUserDetails)
      },
    },
  )
  const [getUserByUsername, { loading: gettingUserByUsername }] = useLazyQuery(
    GET_USER_BY_USERNAME,
    {
      onCompleted({ userDetails }) {
        setUserDetails(userDetails)
      },
      onError(error) {
        reportError(error.message)
        setSearchValue("")
        setUserDetails(emptyUserDetails)
      },
      fetchPolicy: "no-cache",
    },
  )

  const [updateUserStatus] = useMutation(USER_UPDATE_STATUS, {
    onCompleted({ mutationData }) {
      setUserDetails(mutationData.userDetails)
      alert(`${userDetails.username}'s account level has been changed successfully`)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
    },
  })

  const [updateUserLevel] = useMutation(USER_UPDATE_LEVEL, {
    onCompleted({ mutationData }) {
      setUserDetails(mutationData.userDetails)
      alert(`${userDetails.username}'s account status has been changed successfully`)
    },
    onError(error) {
      console.error(error)
      alert(error.message)
    },
  })

  function changeAccountStatus() {
    const targetStatus = userDetails.status === "ACTIVE" ? "LOCKED" : "ACTIVE"
    const confirmation = window.confirm(
      `Clicking OK will change ${userDetails.phone}'s status to ${targetStatus}. Do you wish to proceed?`,
    )
    if (confirmation) {
      updateUserStatus({
        variables: { input: { uid: userDetails.id, status: targetStatus } },
      })
    }
  }

  function changeLevel() {
    updateUserLevel({ variables: { input: { uid: userDetails.id, level: "TWO" } } })
  }

  const [searchValue, setSearchValue] = useState("")

  const search = () => {
    if (!searchValue) return

    if (validPhone(searchValue)) {
      return getUserByPhone({ variables: { phone: searchValue } })
    }

    if (validUsername(searchValue)) {
      return getUserByUsername({ variables: { username: searchValue } })
    }

    setUserDetails(emptyUserDetails)
    reportError("User not found")
  }

  const userDetailsUpdated = ({ username }) => {
    getUserByUsername({ variables: { username } })
  }

  const loading = gettingUserByPhone || gettingUserByUsername
  let detailClass = userDetails === emptyUserDetails || loading ? "filter blur-sm" : ""
  detailClass = detailClass + (loading ? " animate-pulse" : "")
  if (!userDetails) setUserDetails(emptyUserDetails)

  return (
    <div>
      <SearchHeader
        placeholder="Enter user's phone number or user name"
        value={searchValue}
        onChange={setSearchValue}
        onEnter={search}
      />
      <h1 className="mx-6 mt-6 text-2xl font-semibold text-gray-700">
        User details
        {(gettingUserByPhone || gettingUserByUsername) && (
          <small className="animate-pulse font-thin text-sm"> (loading...)</small>
        )}
      </h1>
      <div className="grid gap-6 mb-8 md:grid-cols-2 p-6">
        <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
          <div className="">
            <p className="mb-4 font-semibold text-gray-600">Phone</p>
            <p className={`text-gray-600 ${detailClass}`}>{userDetails.phone}</p>
          </div>
          <div className="">
            <p className="mb-4 font-semibold text-gray-600">Username</p>
            <p className={`text-gray-600 ${detailClass}`}>
              {userDetails.username ?? "--"}
            </p>
          </div>
          <div className="">
            <p className="mb-4 font-semibold text-gray-600">Title</p>
            <p className={`text-gray-600 ${detailClass}`}>{userDetails.title ?? "--"}</p>
          </div>
          <div className="">
            <p className="mb-4 font-semibold text-gray-600">Coordinates</p>
            <p className={`text-gray-600 ${detailClass}`}>
              {userDetails.coordinates ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  href={`https://maps.google.com/?q=${
                    userDetails.coordinates.latitude +
                    "," +
                    userDetails.coordinates.longitude
                  }`}
                >
                  {userDetails.coordinates.latitude +
                    ", " +
                    userDetails.coordinates.longitude}
                </a>
              ) : (
                "--"
              )}
            </p>
          </div>
          <div className="col-span-2">
            <p className="mb-4 font-semibold text-gray-600">Created At</p>
            <p className={`text-gray-600 ${detailClass}`}>
              {formatDate(userDetails.createdAt)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-2 gap-4">
            <div className="">
              <p className="mb-4 font-semibold text-gray-600">Level</p>
              <p className={`text-gray-600 ${detailClass}`}>
                {userDetails.level}
                {userDetails.level === "ONE" && (
                  <button
                    onClick={changeLevel}
                    className="text-sm mx-4 bg-green-500 hover:bg-green-700 text-white font-bold p-2 border border-green-700 rounded disabled:opacity-50"
                  >
                    Upgrade
                  </button>
                )}
              </p>
            </div>
            <div className="">
              <p className="mb-4 font-semibold text-gray-600">Status</p>
              <p className={`text-gray-600 ${detailClass}`}>
                {userDetails.status}
                <button
                  onClick={changeAccountStatus}
                  className={`text-sm mx-4 bg-${
                    userDetails.status === "ACTIVE" ? "red" : "green"
                  }-500 hover:bg-${
                    userDetails.status === "ACTIVE" ? "red" : "green"
                  }-700 text-white font-bold p-2 border border-${
                    userDetails.status === "ACTIVE" ? "red" : "green"
                  }-700 rounded disabled:opacity-50`}
                >
                  {userDetails.status === "ACTIVE" ? "Lock" : "Activate"}
                </button>
              </p>
            </div>
          </div>
          <div className="shadow p-6 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white grid grid-cols-1 gap-4">
            <AddToMap
              disabledClass={detailClass}
              username={
                userDetails !== emptyUserDetails ? userDetails.username || "" : ""
              }
              title={userDetails !== emptyUserDetails ? userDetails.title || "" : ""}
              latitude={
                userDetails !== emptyUserDetails && userDetails.coordinates
                  ? userDetails.coordinates.latitude + ""
                  : ""
              }
              longitude={
                userDetails !== emptyUserDetails && userDetails.coordinates
                  ? userDetails.coordinates.longitude + ""
                  : ""
              }
              onChange={userDetailsUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
