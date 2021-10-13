import React, { useState, useMemo } from "react"

export const SidebarContext = React.createContext()

export const SidebarProvider = (props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const closeSidebar = () => setIsSidebarOpen(false)

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
    }),
    [isSidebarOpen],
  )

  return <SidebarContext.Provider value={value}>{props.children}</SidebarContext.Provider>
}
