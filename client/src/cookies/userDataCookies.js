import Cookies from 'js-cookie';

const USER_DATA = "user-data";

export const saveUserOnCookie = (userData) => {
    const jsonUserData = JSON.stringify(userData);
    Cookies.set(USER_DATA, jsonUserData, { expires: 1/24, sameSite: "strict" });
    if (!Cookies.get(USER_DATA)) {
        console.log('user data size is too large to be contained in a cookie')
    }
};

export const deleteUserFromCookie = () => {
    Cookies.remove(USER_DATA, { sameSite: "strict" });
};

export const getUserFromCookie = () => {
    const jsonUserData = Cookies.get(USER_DATA);
    if (jsonUserData === undefined) return null;

    return JSON.parse(jsonUserData);
};