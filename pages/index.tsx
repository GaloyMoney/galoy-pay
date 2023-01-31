"use client"

import dynamic from "next/dynamic"
import config from "../config"
const Home = dynamic(() => import("../components/home"), {
  ssr: false,
})

export async function getServerSideProps() {
  const publicConfig = config()

  return { props: { publicConfig } }
}

export default Home
