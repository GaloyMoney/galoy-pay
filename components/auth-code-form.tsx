"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"

import { validAuthCode, reportError } from "../utils"
import { useRouter } from "next/navigation"
import { LOGIN } from "../graphql/mutations"

const AuthCodeForm: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [login, { loading: userLoginLoading }] = useMutation(LOGIN)

  const submitOtp: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const { errors: loginErrors, data } = await login({
      variables: { input: { phone: phoneNumber, code: otp } },
    })

    if (loginErrors) {
      return reportError(loginErrors[0])
    }

    if (data?.userLogin) {
      const { errors, authToken } = data.userLogin

      if (errors.length > 0) {
        return reportError(errors[0])
      }

      if (authToken) {
        window.sessionStorage.setItem("token", authToken)
        router.push("/account")
      } else {
        alert("Could not execute operation")
      }
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

export default AuthCodeForm
