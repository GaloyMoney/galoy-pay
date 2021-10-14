import React from "react"
import Dashboard from "./components/Dashboard"
import UserDetails from "./components/UserDetails"
import AddToMap from "./components/AddToMap"

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
    name: "Add to map",
    icon: "LocationIcon",
    path: "/addToMap",
    showInSidebar: true,
    component: () => <AddToMap />,
  },
]
