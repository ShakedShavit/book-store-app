import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { logoutAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { deleteUserFromCookie } from '../../cookies/userDataCookies';

const Header = () => {
    const history = useHistory();

    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const onClickLogOut = () => {
        dispatchUserData(logoutAction());
        deleteUserFromCookie();
        history.push('/home');
    }

    console.log(userDataState.user, process.env.REACT_APP_ADMIN_EMAIL)

    return (
        <div className="header">
            <NavLink to="/home">Home</NavLink>
            {
                !!userDataState.user ?
                <div>
                    <div>
                        <span>Hello {userDataState.user.username}</span>
                        <span onClick={onClickLogOut}>Logout</span>
                        
                        <NavLink to="/cart">Shopping Cart</NavLink>
                    </div>
                    {
                        // userDataState.user.email === 
                    }
                </div> :
                <div>
                    <span>Hello Guest</span>
                    <NavLink to="/login">Login</NavLink>
                    <span> / </span>
                    <NavLink to="/signup">Sign Up</NavLink>
                </div>
            }
        </div>
    );
}

export default Header;