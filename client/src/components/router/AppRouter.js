import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import LoginContextProvider from '../../context/loginContext';
import Header from '../main/Header';
import HomePage from '../home/HomePage';
import NotFoundPage from '../not-found/NotFoundPage';
import LoginForm from '../login/LoginForm';
import SignupForm from '../login/SignupForm';
import ShoppingCart from '../shoppingCart/ShoppingCart';
import LoginRoute from './LoginRoute';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Header />
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/home" />
                    </Route>
                    <Route path="/home" component={HomePage} />
                    <LoginRoute path="/login" component={LoginForm} />
                    <Route path="/signup" component={SignupForm} />
                    <PrivateRoute path="/cart" component={ShoppingCart} />
                    <Route path="*" component={NotFoundPage} />
                </Switch>
            </LoginContextProvider>
        </BrowserRouter>
    );
}

export default AppRouter;