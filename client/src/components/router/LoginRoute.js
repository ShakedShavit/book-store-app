import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';

const LoginRoute = ({ component: Component, ...rest }) => {
    const { userDataState } = useContext(LoginContext);

    return (
        <Route
            { ...rest }
            component={(props) => (
                !!userDataState.user ?
                <Redirect to='/home' />:
                <Component { ...props } />
            )}
        />
    );
}

export default LoginRoute;