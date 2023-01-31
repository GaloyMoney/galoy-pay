"use client"

import Icons, { IconType } from "./icons"

const Icon: React.FC<{ icon: IconType; className?: string }> = ({
  icon,
  className,
  ...props
}) => {
  const Icon = Icons[icon]

  return <Icon className={className} {...props} />
}

export default Icon
