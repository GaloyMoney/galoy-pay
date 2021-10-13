import React from "react"
import Footer from "../components/Footer"

function NotFound() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="m-auto grid grid-rows-2 grid-flow-col gap-4 text-center">
        <h1 className="text-6xl font-semibold text-gray-800">404</h1>
        <p className="text-gray-600">
          Page not found. Please check the address or{" "}
          <a className="text-blue-600 hover:underline" href="/dashboard/">
            go to dashboard
          </a>
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
