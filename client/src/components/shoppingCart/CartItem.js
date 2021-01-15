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

    return (
        <div>
            {
                !!book &&
                <div>
                    <div className="">
                        <img src={`http://localhost:5000/books/image?name=${book.name}`} alt={book.name} className=""></img>
                        <span className="">{book.name}</span>
                        <span className="">{book.author}</span>
                        <span className="">{book.price}$</span>
                        <span>{props.quantity}</span>
                        <form onSubmit={addOrRemoveBookByQuantity}>
                            <button type="submit" className="" onClick={() => setIsAddClicked(true)}>add</button>
                            <input type="number" name="change-quantity-input" placeholder="0" />
                            <button type="submit" className="" onClick={() => setIsAddClicked(false)}>remove</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default CartItem;