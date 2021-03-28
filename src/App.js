import Login from "./components/Login";
import { useRoutes } from "hookrouter";
import Dashboard from "./components/Dashboard";
import UserDetails from "./components/UserDetails";
import AddToMap from "./components/AddToMap";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const routes = {
  "/": () => <Login />,
  "/dashboard": () => (isAuthenticated() ? <Dashboard /> : <Login />),
  "/dashboard/userDetails": () =>
    isAuthenticated() ? <UserDetails /> : <Login />,
  "/dashboard/addToMap": () => (isAuthenticated() ? <AddToMap /> : <Login />),
};

function App() {
  let routeResult = useRoutes(routes);

  return routeResult || <Login />;
}
export default App;
