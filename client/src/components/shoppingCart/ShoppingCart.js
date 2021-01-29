import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import CartItem from './CartItem';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import ConfirmPurchaseModal from './ConfirmPurchaseModal';

const ShoppingCart = () => {
    const { userDataState } = useContext(LoginContext);

    const [books, setBooks] = useState([]);
    const [isConfirmPurchaseModalOpen, setIsConfirmPurchaseModalOpen] = useState(false);

    let isMounted = true;

    useEffect(() => {
        saveUserOnCookie(userDataState);

        let booksArr = [];
        userDataState.user.cart.books.forEach(bookId => {
            let isBookIncluded = false;
            booksArr.forEach(book => {
                if (book.id === bookId) {
                    book.quantity++;
                    isBookIncluded = true;
                }
            });
            if (!isBookIncluded) {
                booksArr.push({ id: bookId, quantity: 1 });
            }
        });

        if (isMounted) setBooks(booksArr);
    }, [userDataState])

    let totalPriceFixed = parseFloat(userDataState.user.cart.totalPrice).toFixed(2);
    if (totalPriceFixed.toString() === '0.00') totalPriceFixed = 0;

    const confirmPurchase = () => {
        setIsConfirmPurchaseModalOpen(true);
    }

    useEffect(() => {
        return () => isMounted = false;
    }, []);

    return (
        <div>
            <div className="cart-container">
                <button className="purchase-button" onClick={confirmPurchase}>Finalize Purchase</button>

                {books.map((book) => (
                    <CartItem key={book.id} bookId={book.id} quantity={book.quantity} />
                ))}
                <div className="total-price-container">
                    <span className="total-price">Total</span>
                    <span className="total-price">{totalPriceFixed}$</span>
                </div>
            </div>

            {isConfirmPurchaseModalOpen && <ConfirmPurchaseModal setIsConfirmPurchaseModalOpen={setIsConfirmPurchaseModalOpen} />}
        </div>
    );
};

export default ShoppingCart;