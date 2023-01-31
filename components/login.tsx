"use client"

import { useState } from "react"

import Footer from "./footer"
import PhoneNumberForm from "./phone-number-form"
import CaptchaChallenge from "./captcha-challenge"
import Image from "next/image"

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState<string>()

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50">
      <div className="flex-1 h-full max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="flex h-32 md:h-auto md:w-1/2">
            <Image
              src="/logo.png"
              alt="Bitcoin Beach logo"
              className="m-auto filter invert"
              width={81}
              height={76}
              priority={true}
            />
          </div>
          <main className="p-6 sm:p-12 md:w-1/2">
            <h1 className="block text-3xl font-extrabold text-gray-900">Welcome</h1>
            <div className="py-4">
              {phoneNumber ? (
                <CaptchaChallenge phoneNumber={phoneNumber} />
              ) : (
                <div className="login">
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
