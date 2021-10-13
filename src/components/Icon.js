import React from "react"
import PropTypes from "prop-types"
import * as Icons from "../icons"

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

Icon.propTypes = {
  icon: PropTypes.string,
}

export default Icon
