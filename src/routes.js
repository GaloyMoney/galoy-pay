import React from "react"
import Dashboard from "./components/Dashboard"
import AccountDetails from "./components/AccountDetails"
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
    name: "Account details",
    icon: "PeopleIcon",
    path: "/accountDetails",
    showInSidebar: true,
    component: () => <AccountDetails />,
  },
  {
    name: "Transactions",
    icon: "TransactionsIcon",
    path: "/transactions",
    showInSidebar: true,
    component: () => <TransactionDetails />,
  },
]
