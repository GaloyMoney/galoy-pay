"use client"

import dynamic from "next/dynamic"
import config from "../config"
const Account = dynamic(() => import("../components/account"), {
  ssr: false,
})

export async function getServerSideProps() {
  const publicConfig = config()

  return { props: { publicConfig } }
}

export default Account
