import React from "react"
import PropTypes from "prop-types"

function Header({ children }) {
  return (
    <header className="z-40 py-4 bg-white shadow-bottom">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600">
        {children}
      </div>
    </header>
  )
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
