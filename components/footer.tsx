"use client"

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="w-full p-4 fixed bottom-0">
      <p className="text-center text-gray-500 text-xs">&copy;{year} Galoy Inc.</p>
    </footer>
  )
}

export default Footer
