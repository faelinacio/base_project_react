import React from "react";
import {useSelector} from "react-redux";
import {Redirect} from 'react-router-dom'

const RequireAuth = (ComposedComponent) => {
  const ReactFunctionComponent = () => {
    const isUserLogged = useSelector(state => state.session.isLogged);

    return isUserLogged ? <ComposedComponent /> : <Redirect to='/login'/>;
  };

  return ReactFunctionComponent;
}


export default RequireAuth;
