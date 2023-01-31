"use client"

import { useState } from "react"

import { validPhone } from "../utils"

type Props = {
  onSuccess: (phone: string) => void
}

const PhoneNumberForm: React.FC<Props> = ({ onSuccess }) => {
  const [phone, setPhone] = useState("")

  const submitPhone: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    onSuccess(phone)
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
        Login
      </button>
    </form>
  )
}

export default PhoneNumberForm
