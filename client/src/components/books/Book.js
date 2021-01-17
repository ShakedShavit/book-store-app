import React, { useContext, useEffect, useState } from 'react';
import { addBookToCartAction } from '../../actions/userCartActions';
import { LoginContext } from '../../context/loginContext';
import { addBookToCartInDB } from '../../server/db/user';
import addItemToCartIcon from '../../images/shopping-carts/add-book-to-cart-2.png'
import checkIcon from '../../images/shopping-carts/checked-svgrepo-com.svg';
import GoToCheckoutModal from './GoToCheckoutModal';
import deleteBookSymbol from '../../images/books/delete-book-6.png';
// if a book is added to cart disable the possibility to add other books before dispatch action is done!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const Book = (props) => {
    const {userDataState, dispatchUserData} = useContext(LoginContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookChecked, setIsBookChecked] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [bookWrapperClassList, setBookWrapperClassList] = useState('book-wrapper');
    const [isShowDeleteBookIcon, setIsShowDeleteBookIcon] = useState(false);

    useEffect(() => {
        if (userDataState.user?.isAdmin) {
            setBookWrapperClassList('book-wrapper book-wrapper-admin');
        }
        else {
            setBookWrapperClassList('book-wrapper');
        }
    }, [userDataState.user]);

    useEffect(() => {
        return () => {
            setIsBookChecked(false);
            setIsComponentMounted(false);
        }
    }, []);

    const bookName = props.book.name;

    const addBookToCart = () => {
        if (props.isBookAddedToCart) {
            return;
        }
        props.setIsBookAddedToCart(true); //
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
                    props.setIsBookAddedToCart(false);
                }
            }, 1500);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const onHoverShowDeleteIcon = () => {
        if (userDataState.user?.isAdmin) {
            setIsShowDeleteBookIcon(true);
        }
    }
    const onLeaveHoverHideDeleteIcon = () => {
        if (userDataState.user?.isAdmin) {
            setIsShowDeleteBookIcon(false);
        }
    }

    return (
        <div>
            <div className={bookWrapperClassList} onMouseEnter={onHoverShowDeleteIcon} onMouseLeave={onLeaveHoverHideDeleteIcon}>
                {
                    isShowDeleteBookIcon &&
                    <img src={deleteBookSymbol} alt="delete-book" className="delete-icon-container"></img>
                }
                <img src={`http://localhost:5000/books/image?name=${bookName}`} alt={bookName} className="book-image"></img>
                <span className="book-name">{bookName}</span>
                <span className="author-name">{props.book.author}</span>
                <div className="price-and-button-container">
                {
                    !!userDataState.user && !userDataState.user.isAdmin &&
                    <div>
                    {
                        isBookChecked ?
                            <div>
                            <img src={checkIcon} alt="item-checked-icon" className="icon-container"></img>
                            </div> :
                            <button className={props.addToCartImageClassList} onClick={addBookToCart} disabled={isButtonDisabled}>
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