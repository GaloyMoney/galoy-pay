import React from "react"
import PropTypes from "prop-types"
import { A, usePath } from "hookrouter"
import Icon from "./Icon"
import { dashboardRoutes } from "../routes"
import { logout } from "../utils"

function SideBar({ basePath }) {
  const currentPath = usePath()
  return (
    <aside className="z-30 flex-shrink-0 hidden w-64 overflow-y-auto bg-white lg:block">
      <div className="py-4 text-gray-500">
        <a className="ml-6 text-lg font-bold text-gray-800" href="#">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Bitcoin Beach logo"
            className="w-9 inline filter invert"
          />{" "}
          Admin Panel
        </a>
        <ul className="mt-6">
          {dashboardRoutes.map((route) => (
            <li className="relative px-6 py-3" key={route.name}>
              <A
                href={basePath + route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800"
              >
                {currentPath === basePath + route.path && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </A>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-3 fixed bottom-0 text-gray-500">
        <A
          href="#"
          onClick={logout}
          className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800"
        >
          <Icon className="w-5 h-5" aria-hidden="true" icon="LogoutIcon" />
          <span className="ml-4">Logout</span>
        </A>
      </div>
    </aside>
  )
}

SideBar.propTypes = {
  basePath: PropTypes.string,
}

export default SideBar
