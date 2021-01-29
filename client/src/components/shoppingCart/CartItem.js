import React, { useContext, useEffect, useState } from 'react';
import { addBookToCartAction, removeBookFromCartAction } from '../../actions/userCartActions';
import { LoginContext } from '../../context/loginContext';
import { getBookFromDB } from '../../server/db/book';
import { addBookToCartInDB, removeBookFromCartInDB } from '../../server/db/user';

const CartItem = (props) => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [book, setBook] = useState(null);
    const [isAddClicked, setIsAddClicked] = useState(false);

    useEffect(() => {
        let mounted = true;

        getBookFromDB(props.bookId)
        .then((res) => {
            if (mounted) {
                setBook(res.data);
            }
        })
        .catch((err) => {
            console.log(err);
        });

        return () => mounted = false;
    }, [userDataState.user.cart])

    const addOrRemoveBookByQuantity = (e) => {
        e.preventDefault();
        const amount = e.target[1].value;
        if (amount && isAddClicked) {
            addBookToCartInDB(book.name, userDataState.token, amount)
            .then((res) => {
                dispatchUserData(addBookToCartAction(res.data.bookId, amount, parseFloat(res.data.totalPrice)));
            })
            .catch((err) => {
                console.log(err);
            });
        } else if (amount) {
            removeBookFromCartInDB(book.name, userDataState.token, amount)
            .then((res) => {
                dispatchUserData(removeBookFromCartAction(res.data.bookId, amount, parseFloat(res.data.totalPrice)));
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    const eraseNumberNegative = (e) => {
        if (e.target.value < 0) e.target.value = 0;
    }

    return (
        <div >
            {
                !!book &&
                <div className="item-wrapper">
                    <div className="green-circle"></div>
                    <div className="cart-item-container">
                        <div className="item-content">
                            <img src={`http://localhost:5000/books/image?name=${book.name}`} alt={book.name} className="item-image"></img>
                            <div className="item-info">
                                <span className="book-name">{book.name}</span>
                                <span className="author-name">{book.author}</span>
                                <div className="price-and-quantity">
                                    <span className="item-quantity">Quantity: {props.quantity}</span>
                                    <span className="item-price">{book.price}$</span>
                                </div>
                            </div>
                        </div>
                        <form className="item-quantity-form" onSubmit={addOrRemoveBookByQuantity} >
                            <button type="submit" className="button first-button" onClick={() => setIsAddClicked(true)}><b>add</b></button>
                            <input type="number" name="change-quantity-input" placeholder="0" className="input" onChange={eraseNumberNegative} />
                            <button type="submit" className="button second-button" onClick={() => setIsAddClicked(false)}><b>remove</b></button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default CartItem;