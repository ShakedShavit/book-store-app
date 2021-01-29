import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';
import { loginUserInDB } from '../../server/db/user';
import { loginAction } from '../../actions/loginActions';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import Loader from '../main/Loader';

const LoginForm = () => {
    const history = useHistory();

    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [firstInput, setFirstInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isFirstInputValid, setIsFirstInputValid] = useState(true);
    const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const [hasLoginFailed, setHasLoginFailed] = useState(false);
    const [hasLoginStarted, setHasLoginStarted] = useState(false);


    const onBlurEmailOrUsernameInput = (e) => {
        const input = e.target.value.trim();
        if (input === "") {
            setFirstInput("");
            setIsFirstInputValid(false);

        } else {
            setFirstInput(input);
            setIsFirstInputValid(true);

            if (passwordInput.length > 6) setIsFormValid(true);
            else setIsFormValid(false);
        }
    }

    const onBlurPasswordInput = (e) => {
        const input = e.target.value.trim();
        if (input.length < 6) {
            setPasswordInput("");
            setIsPasswordInputValid(false);
        } else {
            setPasswordInput(input);
            setIsPasswordInputValid(true);

            if (firstInput !== "") setIsFormValid(true);
            else setIsFormValid(false);
        }
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        setHasLoginStarted(true);

        const usernameOrEmail = e.target[0].value;
        const password = e.target[1].value;
        
        loginUserInDB(usernameOrEmail, password)
        .then((res) => {
            dispatchUserData(loginAction({ user: res.user, token: res.token }));
            saveUserOnCookie(res);
            // setHasLoginFailed(false);

            history.push('/home');
        })
        .catch((err) => {
            console.log(err);
            setHasLoginFailed(true);
        })
    }

  return (
    <div>
        <form className="form" onSubmit={onSubmitForm}>
            <input type="text" name="username/email" placeholder="Username or Email" onBlur={onBlurEmailOrUsernameInput} />
            {!isFirstInputValid && <span className="invalid-message">* You must enter your username or your email!</span>}
            <input type="password" name="password" placeholder="password" onBlur={onBlurPasswordInput} />
            {!isPasswordInputValid && <span className="invalid-message">* Password is too short!</span>}
            <button type="submit" disabled={!isFormValid}>Login</button>

            {hasLoginFailed && <span className="invalid-message">* Login failed. Please try again</span>}

            <NavLink to="/signup">Sign Up</NavLink>
        </form>
        
        {
            hasLoginStarted && !hasLoginFailed && !userDataState.user &&
            <Loader />
        }
    </div>
  );
}

export default LoginForm;