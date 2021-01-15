import React, { useContext, useEffect, useState } from 'react';
import { addBookToCartAction } from '../../actions/userCartActions';
import { LoginContext } from '../../context/loginContext';
import { addBookToCartInDB } from '../../server/db/user';
import addItemToCartIcon from '../../images/shopping-carts/add-book-to-cart-2.png'
import checkIcon from '../../images/shopping-carts/checked-svgrepo-com.svg';
import GoToCheckoutModal from './GoToCheckoutModal';

const Book = (props) => {
    const {userDataState, dispatchUserData} = useContext(LoginContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookChecked, setIsBookChecked] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        return () => {
            setIsBookChecked(false);
            setIsComponentMounted(false);
        }
    }, []);

    const bookName = props.book.name;

    const addBookToCart = () => {
        setIsButtonDisabled(true);
        setIsModalOpen(true);
        addBookToCartInDB(bookName, userDataState.token)
        .then((res) => {
            dispatchUserData(addBookToCartAction(res.data.bookId, parseInt(res.data.quantity), parseFloat(res.data.totalPrice)));
            // The problem is here, the userDataState is not updating properly although everything in the reducer seems to be in order
            // console.log(userDataState.user)
            // saveUserOnCookie(userDataState);

            setIsButtonDisabled(false);
            setIsBookChecked(true);
            setTimeout(() => {
                if (isComponentMounted) {
                    setIsBookChecked(false);
                }
            }, 1500);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    return (
        <div>
            <div className="book-wrapper">
            <img src={`http://localhost:5000/books/image?name=${bookName}`} alt={bookName} className="book-image"></img>
            <span className="book-name">{bookName}</span>
            <span className="author-name">{props.book.author}</span>
            <div className="price-and-button-container">
            {
                !!userDataState.user && userDataState.user.email !== process.env.REACT_APP_ADMIN_EMAIL &&
                <div>
                {
                    isBookChecked ?
                        <div>
                        <img src={checkIcon} alt="item-checked-icon" className="icon-container"></img>
                        </div> :
                        <button className="icon-container add-item-to-cart-button" onClick={addBookToCart} disabled={isButtonDisabled}>
                            <img src={addItemToCartIcon} alt="add-item-to-shopping-cart-icon" className="add-item-to-cart-icon"></img>
                        </button>
                }
                </div>
                
            }
            <span className="price">{props.book.price}$</span>
            </div>
            </div>

            {isModalOpen && <GoToCheckoutModal setIsModalOpen={setIsModalOpen} />}
        </div>
        
    )
}

export default Book;