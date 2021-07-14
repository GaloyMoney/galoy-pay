import Login from './components/Login'
import { useRoutes, navigate } from 'hookrouter'
import Dashboard from './components/Dashboard'
import UserDetails from './components/UserDetails'
import AddToMap from './components/AddToMap'
import { isAuthenticated } from './utils'

const routes = {
  '/': () => <Login />,
  '/dashboard*': () => <AuthedPages />
}

const dashboardRoutes = {
  '/': () => <Dashboard />,
  '/userDetails': () => <UserDetails />,
  '/addToMap': () => <AddToMap />
}

const AuthedPages = () => {
  const routeResult = useRoutes(dashboardRoutes)
  if (!isAuthenticated()) {
    navigate('/')
  }
  return routeResult
}

function App() {
  const routeResult = useRoutes(routes)

  return routeResult || <Login />
}
export default App
