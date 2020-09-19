import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "../../pages/Login";
import Home from "../../pages/Home";
import RequireAuth from "./RequireAuth";
import Header from "../../components/Header";
import {useSelector} from "react-redux";
import UserList from "../../pages/users/UserList";
import User from "../../pages/users/User";

const Router = () => {
  const isUserLogged = useSelector(state => state.session.isLogged);

  const routes = [
    {path: '/home', component: RequireAuth(Home), exact: true, key: 'home', title: "Home"},
    {path: '/login', component: Login, exact: true, key: 'login', title: "Login"},
    {path: '/user', component: RequireAuth(User), exact: true, key: 'user', title: "User"},
    {path: '/userList', component: RequireAuth(UserList), exact: true, key: 'userList', title: "User List"},

    {path: '/', component: () => <Redirect to='/home'/>, exact: false, key: 'root'}
  ];

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(route =>
          <Route
            exact={route.exact} path={route.path} key={route.key}
            children={() =>
              <div key={route.key}>
                { isUserLogged ? <Header title={route.title}/> : null}
                {<route.component/>}
              </div>
            }
          />)}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
