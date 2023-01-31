"use client"

import dynamic from "next/dynamic"
const Account = dynamic(() => import("../components/account"), {
  ssr: false,
})

export default Account
