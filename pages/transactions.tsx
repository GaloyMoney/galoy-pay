"use client"

import dynamic from "next/dynamic"
const Transactions = dynamic(() => import("../components/transactions"), {
  ssr: false,
})

export default Transactions
