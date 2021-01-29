import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { logoutAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { deleteUserFromCookie } from '../../cookies/userDataCookies';
import homeIcon from '../../images/header/home7.png';
import logoutIcon from '../../images/header/logout.png';
import cartIcon from '../../images/header/cart.png';

const Header = () => {
    const history = useHistory();

    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const onClickLogOut = () => {
        dispatchUserData(logoutAction());
        deleteUserFromCookie();
        history.push('/home');
    }

    return (
        <div className="header">
            <NavLink to="/home"><img src={homeIcon} className="header-icons"></img></NavLink>
            {
                !!userDataState.user ?
                <div className="header-content">
                    <span className="welcome-text">Hello {userDataState.user.username}</span>

                    {
                        !userDataState.user.isAdmin &&
                        <NavLink to="/cart"><div className="header-cart-icon"><img src={cartIcon} className="header-icons"></img><div className="cart-books-number">{userDataState.user.cart.books.length}</div></div></NavLink>
                    }

                    <span onClick={onClickLogOut}><img src={logoutIcon} className="header-icons"></img></span>
                </div> :
                <div className="header-content">
                    <span className="welcome-text">Hello Guest</span>
                    <div className="links-container">
                        <NavLink to="/login" className="login-nav-link" activeClassName="active-link-login">Login</NavLink>
                        <NavLink to="/signup" className="login-nav-link" activeClassName="active-link-login">Sign Up</NavLink>
                    </div>
                </div>
            }
        </div>
    );
}

export default Header;