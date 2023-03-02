"use client"

import { useState } from "react"

import { validAuthCode, reportError } from "../utils"
import { useRouter } from "next/navigation"
import config from "../config"

const AuthCodeForm: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [userLoginLoading, setUserLoginLoading] = useState(false)

  const submitOtp: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const raw = JSON.stringify({
      phoneNumber,
      authCode: otp,
    })
    setUserLoginLoading(true)
    try {
      const loginResp = await fetch(`${config().GALOY_AUTH_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
        redirect: "follow",
        credentials: "include",
      })
      if (loginResp instanceof Error) return reportError(loginResp)
      window.sessionStorage.setItem("token", "loggedInWithCookie")
      router.push("/account")
    } catch (e) {
      return reportError({
        message: "Error logging in",
      })
    } finally {
      setUserLoginLoading(false)
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
