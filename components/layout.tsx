"use client"

import SideBar from "./side-bar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <div className="flex flex-col flex-1 w-full">
        <main className="h-full overflow-y-auto">
          <div className="container grid mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
