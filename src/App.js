import "./App.css";
import Login from "./components/Login";
import { useRoutes } from "hookrouter";
import Dashboard from "./components/Dashboard";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const routes = {
  "/": () => <Login />,
  "/dashboard": () => (isAuthenticated() ? <Dashboard /> : <Login />),
};

function App() {
  let routeResult = useRoutes(routes);

  return routeResult || <Login />;
}
export default App;
