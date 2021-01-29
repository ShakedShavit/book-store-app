import deepcopy from 'deepcopy';

export const initialUserDataState = {
    user: null,
    token: ""
};

const loginReducer = (userData, action) => {
    let user;
    let cart;
    switch (action.type) {
        case "LOGIN":
            user = deepcopy(action.user);
            return { user, token: action.token };
        case "LOGOUT":
            return { user: null, token: "" };
        case "ADD_BOOK_TO_CART":
            const addedBooksArr = [];
            for (let i = 0; i < action.quantity; i++) {
                addedBooksArr.push(action.bookId);
            }
            cart = [ ...userData.user.cart.books ].concat(addedBooksArr);
            user = deepcopy(userData.user);
            user.cart.books = cart;
            user.cart.totalPrice = action.totalPrice;
            // console.log({ user, token: userData.token })
            return { user, token: userData.token };
        case "REMOVE_BOOK_FROM_CART":
            cart = [ ...userData.user.cart.books ];
            for (let i = 0; i < action.quantity; i++) {
                const index = cart.indexOf(action.bookId);
                if (index > -1) {
                    cart.splice(index, 1);
                }
            }
            user = deepcopy(userData.user);
            user.cart.books = cart;
            user.cart.totalPrice = action.totalPrice;
            return { user, token: userData.token };
        case "REMOVE_ALL_BOOKS_FROM_CART":
            user = deepcopy(userData.user);
            user.cart.books = [];
            user.cart.totalPrice = 0;
            return { user, token: userData.token }
         default:
            return { ...userData };
    }
}

export default loginReducer;