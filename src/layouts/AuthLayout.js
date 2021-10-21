import React from "react"
import PropTypes from "prop-types"
import SideBar from "../components/SideBar"

function AuthLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar basePath="/dashboard" />
      <div className="flex flex-col flex-1 w-full">
        <main className="h-full overflow-y-auto">
          <div className="container grid mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthLayout
