import Axios from 'axios';

// DATABASE_URL=$(heroku config:get DATABASE_URL -a your-app) your_process

export const loginUserInDB = async (usernameOrEmail, password) => {
    try {
        const res = await Axios.post('http://localhost:5000/users/login', {
            usernameOrEmail,
            password
        });
    
        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to login. Please try again');
        }
    };
};

export const signUpUserInDB = async (username, email, password) => {
    try {
        const res = await Axios.post('http://localhost:5000/users/signup', {
            username,
            email,
            password
        });
    
        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to sign up. Please try again');
        }
    };
};

export const addBookToCartInDB = async (bookName, token, quantity = 1) => {
    try {
        const res = await Axios.patch('http://localhost:5000/users/add-book-to-cart', {
            params: { bookName, quantity }
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        return res;
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to add book to cart');
        }
    };
};

export const removeBookFromCartInDB = async (bookName, token, quantity = 1) => {
    try {
        const res = await Axios.patch('http://localhost:5000/users/remove-book-from-cart', {
            params: { bookName, quantity }
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        return res;
    } catch (err) {
        if (err.response.status === 400) {
            throw new Error('Unable to remove book from cart');
        }
    };
};

export const removeAllBookFromCartInDB = async (token) => {
    try {
        const res = await Axios.patch('http://localhost:5000/users/remove-all-books-from-cart', {}, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        return res;
    } catch (err) {
        if (err.response.status === 500) {
            throw new Error('Unable to remove books from cart');
        }
    };
};

// export const getIsUserAdminFromDB = async (token) => {
//     try {
//         const res = await Axios.get('http://localhost:5000/users/is-admin', {
//             headers: {
//                 'Authorization': `Bearer ${token}` 
//             }
//         });

//         return res;
//     } catch (err) {
//         if (err.response.status === 400) {
//             throw new Error('Bad request');
//         }
//     };
// };