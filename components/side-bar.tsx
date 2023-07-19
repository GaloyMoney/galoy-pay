"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import Icon from "./icon"
import { dashboardRoutes } from "../utils/routes"
import { IconType } from "./icons"
import config from "../config"

function SideBar() {
  const router = useRouter()
  const { GALOY_AUTH_ENDPOINT } = config()
  const logout = async () => {
    await fetch(GALOY_AUTH_ENDPOINT + "/logout")
    clearCookies()
  }
  const clearCookies = async () => {
    await fetch(GALOY_AUTH_ENDPOINT + "/clearCookies", {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    })
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = "/"
  }
  return (
    <aside className="z-30 flex-shrink-0 hidden w-64 overflow-y-auto bg-white lg:block">
      <div className="py-4 text-gray-500">
        <Link className="ml-6 text-lg font-bold text-gray-800" href="/account">
          <Image
            src="/logo.png"
            alt="Bitcoin Beach logo"
            className="w-9 inline filter invert"
            width={81}
            height={76}
            priority={true}
          />{" "}
          Admin Panel
        </Link>
        <ul className="mt-6">
          {dashboardRoutes.map((route) => (
            <li className="relative px-6 py-3" key={route.name}>
              <Link
                href={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800"
              >
                {router.pathname === route.path && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon as IconType}
                />
                <span className="ml-4">{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-3 fixed bottom-0 text-gray-500">
        <Link
          href="#"
          onClick={logout}
          className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800"
        >
          <Icon className="w-5 h-5" aria-hidden="true" icon="LogoutIcon" />
          <span className="ml-4">Logout</span>
        </Link>
      </div>
    </aside>
  )
}

export default SideBar
