import './App.css';
import Login from './components/Login';
import { useRoutes } from 'hookrouter';

const routes = {
  '/': () => <Login />,
};

function App() {

  let routeResult = useRoutes(routes);

  return routeResult || <Login />;
}
export default App;
