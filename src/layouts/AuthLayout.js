import React from "react"
import PropTypes from "prop-types"
import Footer from "../components/Footer"
import SideBar from "../components/SideBar"

function AuthLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar basePath="/dashboard" />
      <main className="h-full overflow-y-auto">
        <div className="container grid px-6 mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthLayout
