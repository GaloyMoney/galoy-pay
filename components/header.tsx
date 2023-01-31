"use client"

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <header className="z-40 py-4 bg-white shadow-bottom">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600">
        {children}
      </div>
    </header>
  )
}

export default Header
