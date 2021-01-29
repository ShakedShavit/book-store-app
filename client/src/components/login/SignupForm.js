import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import validator from 'validator';
import { loginAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import { signUpUserInDB } from '../../server/db/user';
import Loader from '../main/Loader';

const SignupForm = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const history = useHistory();

    const [usernameInput, setUsernameInputInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [repeatPasswordInput, setRepeatPasswordInput] = useState('');
    const [isUsernameInputValid, setIsUsernameInputValid] = useState(true);
    const [isEmailInputValid, setIsEmailInputValid] = useState(true);
    const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);
    const [isRepeatPasswordInputValid, setIsRepeatPasswordInputValid] = useState(true);
    const [isInsideUsernameInput, setIsInsideUsernameInput] = useState(false);
    const [isInsideEmailInput, setIsInsideEmailInput] = useState(false);
    const [isInsidePasswordInput, setIsInsidePasswordInput] = useState(false);
    const [isInsideRepeatPasswordInput, setIsInsideRepeatPasswordInput] = useState(false);
    const [isFormValid, setIsFormValid] = useState(true);
    const [hasLoginFailed, setHasLoginFailed] = useState(false);
    const [hasLoginStarted, setHasLoginStarted] = useState(false);

    const onChangeUsernameInput = (e) => {
        const input = e.target.value.trim();
        setUsernameInputInput(input);
        if (input === "") {
            setIsUsernameInputValid(false);
        } else {
            setIsUsernameInputValid(true);
        }
    }
    const onFocusUsernameInput = () => {
        setIsInsideUsernameInput(true)
    }
    const onBlurUsernameInput = () => {
        setIsInsideUsernameInput(false)
    }


    const onChangeEmailInput = (e) => {
        const input = e.target.value.trim();
        setEmailInput(input);
        if (validator.isEmail(input)) {
            setIsEmailInputValid(true);

        } else {
            setIsEmailInputValid(false);
        }
    }
    const onFocusEmailInput = () => {
        setIsInsideEmailInput(true)
    }
    const onBlurEmailInput = () => {
        setIsInsideEmailInput(false)
    }

    const onChangePasswordInput = (e) => {
        const input = e.target.value.trim();
        setPasswordInput(input);
        if (input.length < 6) {
            setIsPasswordInputValid(false);
        } else {
            setIsPasswordInputValid(true);
        }
    }
    const onFocusPasswordInput = () => {
        setIsInsidePasswordInput(true)
    }
    const onBlurPasswordInput = () => {
        setIsInsidePasswordInput(false)
    }

    const onChangeRepeatPasswordInput = (e) => {
        const input = e?.target.value.trim() || repeatPasswordInput;
        setRepeatPasswordInput(input);
        if (input.length >= 6 && input === passwordInput) {
            setIsRepeatPasswordInputValid(true);
        } else {
            setIsRepeatPasswordInputValid(false);
        }
    }
    const onFocusRepeatPasswordInput = () => {
        setIsInsideRepeatPasswordInput(true)
    }
    const onBlurRepeatPasswordInput = () => {
        setIsInsideRepeatPasswordInput(false)
    }

    useEffect(() => {
        onChangeRepeatPasswordInput();
    }, [passwordInput]);

    useEffect(() => {
        const valid =
        usernameInput !== "" &&
        emailInput !== "" &&
        passwordInput !== "" &&
        repeatPasswordInput === passwordInput &&
        isUsernameInputValid &&
        isEmailInputValid &&
        isPasswordInputValid &&
        isRepeatPasswordInputValid;
        setIsFormValid(!valid);
    }, [usernameInput, emailInput, passwordInput, repeatPasswordInput, isRepeatPasswordInputValid])

    const onSubmitForm = (e) => {
        e.preventDefault();

        setHasLoginStarted(true);

        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        
        signUpUserInDB(username, email, password)
        .then((res) => {
            dispatchUserData(loginAction({ user: res.user, token: res.token }));
            saveUserOnCookie(res);
            setHasLoginFailed(false);
            history.push('/home');
        })
        .catch((err) => {
            setHasLoginFailed(true);
        })
    }

  return (
      <div>
        <form className="form" onSubmit={onSubmitForm}>
            <input type="text" name="username" placeholder="Username"
                onChange={onChangeUsernameInput}
                onFocus={onFocusUsernameInput}
                onBlur={onBlurUsernameInput}
            />
            {!isUsernameInputValid && !isInsideUsernameInput && <span className="invalid-message">Username is invalid or empty</span>}
            <input type="email" name="email" placeholder="Email"
                onChange={onChangeEmailInput}
                onFocus={onFocusEmailInput}
                onBlur={onBlurEmailInput}
            />
            {!isEmailInputValid && !isInsideEmailInput && <span className="invalid-message">Email is invalid or empty</span>}
            <input type="password" name="password" placeholder="Password"
                onChange={onChangePasswordInput}
                onFocus={onFocusPasswordInput}
                onBlur={onBlurPasswordInput}
            />
            {!isPasswordInputValid && !isInsidePasswordInput && <span className="invalid-message">Password is invalid or empty</span>}
            <input type="password" name="repeat-password" placeholder="Repeat password"
                onChange={onChangeRepeatPasswordInput}
                onFocus={onFocusRepeatPasswordInput}
                onBlur={onBlurRepeatPasswordInput}
            />
            {passwordInput !== "" && !isRepeatPasswordInputValid && !isInsideRepeatPasswordInput && <span className="invalid-message">Repeated password does not match password or is empty</span>}
            
            <button type="submit" disabled={isFormValid}>Sign Up</button>

            {hasLoginFailed && <span className="invalid-message">Sign up failed. Please try again</span>}

            <NavLink to="/login">Login</NavLink>
        </form>
        
        {
            hasLoginStarted && !hasLoginFailed && !userDataState.user &&
            <Loader />
        }
      </div>
  );
}

export default SignupForm;