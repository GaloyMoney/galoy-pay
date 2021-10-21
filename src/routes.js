import React from "react"
import Dashboard from "./components/Dashboard"
import UserDetails from "./components/UserDetails"
import TransactionDetails from "./components/TransactionDetails"

export const dashboardRoutes = [
  {
    name: "Dashboard",
    icon: "HomeIcon",
    path: "/",
    showInSidebar: false,
    component: () => <Dashboard />,
  },
  {
    name: "User details",
    icon: "PeopleIcon",
    path: "/userDetails",
    showInSidebar: true,
    component: () => <UserDetails />,
  },
  {
    name: "Transactions",
    icon: "TransactionsIcon",
    path: "/transactions",
    showInSidebar: true,
    component: () => <TransactionDetails />,
  },
]
