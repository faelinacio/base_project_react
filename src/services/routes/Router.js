import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "../../pages/Login";
import Home from "../../pages/Home";
import RequireAuth from "./RequireAuth";

const Router = () => {

  const routes = [
    {path: '/home', component: RequireAuth(Home), exact:true, key: 'home'},
    {path: '/login', component: Login, exact:true, key: 'login'},

    {path: '/', component: () => <Redirect to='/home'/>, exact:false, key: 'root'}
  ];

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(route => <Route exact={route.exact} path={route.path} component={route.component} key={route.key}/>)}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
