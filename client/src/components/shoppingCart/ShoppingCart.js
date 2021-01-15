import React, { useContext, useEffect } from 'react';
import { LoginContext } from '../../context/loginContext';
import CartItem from './CartItem';
import { nanoid } from 'nanoid';
import { saveUserOnCookie } from '../../cookies/userDataCookies';

const ShoppingCart = () => {
    const { userDataState } = useContext(LoginContext);

    useEffect(() => {
        saveUserOnCookie(userDataState);
    }, [userDataState])

    let books = [];
    userDataState.user.cart.books.forEach(bookId => {
        let isBookIncluded = false;
        books.forEach(book => {
            if (book.id === bookId) {
                book.quantity++;
                isBookIncluded = true;
            }
        });
        if (!isBookIncluded) {
            books.push({ id: bookId, quantity: 1 });
        }
    });

    return (
        <div>
        {books.map((book) => (
            <CartItem key={nanoid()} bookId={book.id} quantity={book.quantity} />
        ))}
        <span>Total price: {userDataState.user.cart.totalPrice}</span>
        </div>
    );
}

export default ShoppingCart;