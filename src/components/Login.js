import { navigate } from "hookrouter"
import React from "react"

import { isAuthenticated } from "../utils"

import Footer from "./Footer"
import PhoneNumberForm from "./PhoneNumberForm"
import CaptchaChallenge from "./CaptchaChallenge"

export default function Login() {
  if (isAuthenticated()) navigate("/dashboard")

  const [phoneNumber, setPhoneNumber] = React.useState()

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50">
      <div className="flex-1 h-full max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
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
              {phoneNumber ? (
                <CaptchaChallenge phoneNumber={phoneNumber} />
              ) : (
                <div className="login">
                  <div className="intro">
                    Enter your phone number and we will text you an access code
                  </div>
                  <PhoneNumberForm onSuccess={setPhoneNumber} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
