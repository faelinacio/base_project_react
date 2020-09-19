import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
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
    {path: '/home', component: RequireAuth(Home), exact: true, key: 'home'},
    {path: '/login', component: Login, exact: true, key: 'login'},
    {path: '/user', component: RequireAuth(User), exact: true, key: 'user'},
    {path: '/userList', component: RequireAuth(UserList), exact: true, key: 'userList'},

    {path: '/', component: () => <Redirect to='/home'/>, exact: false, key: 'root'}
  ];

  return (
    <BrowserRouter>
      { isUserLogged ? <Header/> : null}
      <Switch>
        {routes.map(route => <Route exact={route.exact} path={route.path} component={route.component} key={route.key}/>)}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
