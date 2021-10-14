import React from "react"
import Dashboard from "./components/Dashboard"
import UserDetails from "./components/UserDetails"

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
]
