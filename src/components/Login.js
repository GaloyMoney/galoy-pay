import { gql, useMutation } from "@apollo/client"
import { navigate } from "hookrouter"
import React, { useState } from "react"
import { validAuthCode, validPhone, reportError } from "../utils"
import Footer from "./Footer"

const REQUEST_AUTH_CODE = gql`
  mutation userRequestAuthCode($input: UserRequestAuthCodeInput!) {
    mutationData: userRequestAuthCode(input: $input) {
      errors {
        message
      }
      success
    }
  }
`

const LOGIN = gql`
  mutation login($input: UserLoginInput!) {
    mutationData: userLogin(input: $input) {
      errors {
        message
      }
      authToken
    }
  }
`

export default function Login() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpGenerated, setOtpGenerated] = useState(false)

  const [requestAuthCode, { loading: requestAuthCodeLoading }] =
    useMutation(REQUEST_AUTH_CODE)
  const [login, { loading: userLoginLoading }] = useMutation(LOGIN)

  const PhoneForm = () => {
    async function submitPhone(event) {
      event.preventDefault()
      const { error, data } = await requestAuthCode({ variables: { input: { phone } } })
      if (error) {
        return reportError(error.message)
      }

      const { errors, success } = data.mutationData
      if (errors.length > 0) {
        return reportError(errors[0].message)
      }
      if (success) {
        setOtpGenerated(true)
      } else {
        reportError("Could not execute operation")
      }
    }

    return (
      <form onSubmit={submitPhone} className="w-full">
        <input
          id="phone"
          autoFocus
          required
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
        <p className="text-red-500 mt-2 text-xs italic">
          {phone && !validPhone(phone) ? "Invalid phone number" : ""}
        </p>
        <button
          type="submit"
          disabled={!validPhone(phone)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold p-2 my-4 w-full border border-blue-500 rounded disabled:opacity-50"
        >
          {requestAuthCodeLoading ? "Loading..." : "Request auth code"}
        </button>
      </form>
    )
  }

  const OTPForm = () => {
    async function submitOtp(event) {
      event.preventDefault()
      const { error, data } = await login({ variables: { input: { phone, code: otp } } })

      if (error) {
        return reportError(error.message)
      }

      const { errors, authToken } = data.mutationData

      if (errors.length > 0) {
        return reportError(errors[0].message)
      }

      if (authToken) {
        window.sessionStorage.setItem("token", authToken)
        navigate("/dashboard", true)
      } else {
        reportError("Could not execute operation")
      }
    }

    return (
      <form onSubmit={submitOtp}>
        <input
          id="otp"
          autoFocus
          required
          type="text"
          placeholder="Enter Auth Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
        <p className="text-red-500 mt-2 text-xs italic">
          {otp && !validAuthCode(otp) ? "Invalid auth code" : ""}
        </p>
        <button
          type="submit"
          disabled={!validAuthCode(otp)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold p-2 my-4 w-full border border-blue-500 rounded disabled:opacity-50"
        >
          {userLoginLoading ? "Loading..." : "Login"}
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="flex h-32 md:h-auto md:w-1/2">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Bitcoin Beach logo"
              className="m-auto filter invert"
            />
          </div>
          <main className="p-6 sm:p-12 md:w-1/2">
            <h1 className="block text-3xl font-extrabold text-gray-900">Welcome</h1>
            <div className="py-4">
              {!otpGenerated && <PhoneForm />}
              {otpGenerated && <OTPForm />}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
