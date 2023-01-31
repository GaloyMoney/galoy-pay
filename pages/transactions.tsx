"use client"

import dynamic from "next/dynamic"
import config from "../config"
const Transactions = dynamic(() => import("../components/transactions"), {
  ssr: false,
})

export async function getServerSideProps() {
  const publicConfig = config()

  return { props: { publicConfig } }
}

export default Transactions
