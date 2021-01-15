import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { userDataState } = useContext(LoginContext);

    return (
        <Route
            { ...rest }
            component={(props) => (
                !!userDataState.user ?
                <Component { ...props } />:
                <Redirect to="/login" />
                // <Redirect to={ { pathname: "/login", state: {needToLogin: true} } } />
            )}
        />
    );
};

export default PrivateRoute;