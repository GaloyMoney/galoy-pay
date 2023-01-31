"use client"

import Login from "./login"
import AccountDetails from "./account"

import { isAuthenticated } from "../utils"

function Home() {
  if (!isAuthenticated()) {
    return <Login />
  }

  return <AccountDetails />
}

export default Home
