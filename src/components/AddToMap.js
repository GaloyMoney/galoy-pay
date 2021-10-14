import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { gql, useMutation } from "@apollo/client"
import { validAddToMapInputs } from "../utils"

const BUSINESS_UPDATE_MAP_INFO = gql`
  mutation businessUpdateMapInfo($input: BusinessUpdateMapInfoInput!) {
    mutationData: businessUpdateMapInfo(input: $input) {
      errors {
        message
      }
      userDetails {
        id
      }
    }
  }
`

function useStateWithDep(defaultValue) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])
  return [value, setValue]
}

function AddToMap({ disabledClass, username, title, latitude, longitude, onChange }) {
  const [businessUpdateMapInfo, { loading }] = useMutation(BUSINESS_UPDATE_MAP_INFO)
  const [titleVal, setTitleVal] = useStateWithDep(title)
  const [latitudeVal, setLatitudeVal] = useStateWithDep(latitude)
  const [longitudeVal, setLongitudeVal] = useStateWithDep(longitude)

  const submit = async (event) => {
    event.preventDefault()

    const businessInfo = {
      username: username,
      title: titleVal,
      longitude: parseFloat(longitudeVal),
      latitude: parseFloat(latitudeVal),
    }

    if (!validAddToMapInputs(businessInfo)) {
      alert("Invalid input values")
      return
    }

    const { data, errors } = await businessUpdateMapInfo({
      variables: {
        input: businessInfo,
      },
    })

    // TODO: update UI (instead of alerts)

    if (errors || data?.mutationData?.errors.length > 0) {
      console.error({ errors, userErrors: data.mutationData.errors })
      alert("Error adding merchant to map")
    } else {
      onChange(businessInfo)
      alert("Updated successfully!")
    }
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={submit}>
      <div className="">
        <label htmlFor="latitude" className="font-semibold text-gray-600">
          Latitude
        </label>
        <input
          id="latitude"
          required
          type="text"
          placeholder="Enter longitude"
          value={latitudeVal}
          onChange={(e) => setLatitudeVal(e.target.value)}
          disabled={!!disabledClass}
          className={`${disabledClass} mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline`}
        />
      </div>
      <div className="">
        <label htmlFor="longitude" className="font-semibold text-gray-600">
          Longitude
        </label>
        <input
          id="longitude"
          required
          type="text"
          placeholder="Enter longitude"
          value={longitudeVal}
          onChange={(e) => setLongitudeVal(e.target.value)}
          disabled={!!disabledClass}
          className={`${disabledClass} mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline`}
        />
      </div>
      <div className="">
        <label htmlFor="title" className="font-semibold text-gray-600">
          Title
        </label>
        <input
          id="title"
          required
          type="text"
          placeholder="Enter title"
          value={titleVal}
          onChange={(e) => setTitleVal(e.target.value)}
          disabled={!!disabledClass}
          className={`${disabledClass} mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline`}
        />
      </div>
      <div className={`${disabledClass} flex items-end justify-end`}>
        <button
          type="submit"
          disabled={!titleVal || !latitudeVal || !longitudeVal}
          className="mb-0 w-full bg-blue-400 hover:bg-blue-500 text-white font-bold p-2 my-4 border border-blue-500 rounded disabled:opacity-50"
        >
          {loading ? "updating..." : "Update"}
        </button>
      </div>
    </form>
  )
}

AddToMap.propTypes = {
  disabledClass: PropTypes.string,
  username: PropTypes.string,
  title: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  onChange: PropTypes.func,
}

export default AddToMap
