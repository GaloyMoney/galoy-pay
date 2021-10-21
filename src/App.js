import * as React from "react"
import Login from "./components/Login"
import NotFound from "./pages/NotFound"
import { useRoutes, navigate } from "hookrouter"
import AuthLayout from "./layouts/AuthLayout"
import { isAuthenticated } from "./utils"
import { dashboardRoutes } from "./routes"

const routes = {
  "/": () => <Login />,
  "/dashboard*": () => <AuthedPages />,
}

const authRoutes = dashboardRoutes.reduce(
  (r, { path, component }) => ((r[path] = component), r),
  {},
)

const AuthedPages = () => {
  const routeResult = useRoutes(authRoutes)
  if (!isAuthenticated()) navigate("/")
  return routeResult ? <AuthLayout>{routeResult}</AuthLayout> : <NotFound />
}

function App() {
  const routeResult = useRoutes(routes)
  return routeResult || <NotFound />
}

export default App
