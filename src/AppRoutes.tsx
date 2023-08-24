import { Route, RouteProps, Routes } from 'react-router-dom'
import { Home } from './components'
import { CrudReports } from './components/reports/CrudReports';
import { Login } from './components/auth/Login';
import { CrudUsers } from './components/users/CrudUsers';
import { HOME_ROUTE, MANAGE_REPORTS_ROUTE, MANAGE_USERS_ROUTE } from './constants';

const routes: RouteProps [] = [
  {
    element: <CrudReports/>,
    path: MANAGE_REPORTS_ROUTE
  },
  {
    element: <CrudUsers/>,
    path: MANAGE_USERS_ROUTE
  },
  {
    element: <Home/>,
    path: HOME_ROUTE
  },
  {
    element: <Login/>,
    path: "/"
  }
];

export const AppRoutes = () => {
  return (
    <Routes>
        {
          routes.map((route) => (
            <Route
            key={route.path}
            element={route.element}
            path={route.path}/>
          ))
        }
    </Routes>
  )
}
