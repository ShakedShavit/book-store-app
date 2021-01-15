import React, { useContext, useEffect } from 'react';
import { LoginContext } from '../../context/loginContext';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import BooksSectionLoader from '../books/BooksSectionLoader';

const HomePage = () => {
    const { userDataState } = useContext(LoginContext);

    useEffect(() => {
        saveUserOnCookie(userDataState);
    }, [userDataState])

    return (
        <BooksSectionLoader />
    );
}

export default HomePage;