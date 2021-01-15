import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';

const AdminRoute = ({ component: Component, ...rest }) => {
    const { userDataState } = useContext(LoginContext);

    return (
        <Route
            { ...rest }
            component={(props) => (
                !!userDataState.user ?
                <div>
                {
                    userDataState.user.email === process.env.REACT_APP_ADMIN_EMAIL ?
                    <Component { ...props } /> :
                    <Redirect to='/home' />
                }
                </div> :
                <Redirect to='/home' />
            )}
        />
    );
}

export default AdminRoute;