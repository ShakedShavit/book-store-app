import React, { useContext, useEffect, useState } from 'react';
import { addBookToCartAction } from '../../actions/userCartActions';
import { LoginContext } from '../../context/loginContext';
import { addBookToCartInDB } from '../../server/db/user';
import addItemToCartIcon from '../../images/shopping-carts/add-book-to-cart-2.png'
import checkIcon from '../../images/shopping-carts/checked-svgrepo-com.svg';
import GoToCheckoutModal from './GoToCheckoutModal';
import DeleteBookModal from '../admin/DeleteBookModal';
import deleteBookSymbol from '../../images/books/delete-book-6.png';
import EditBookModal from '../admin/EditBookModal';
import editBookSymbol from '../../images/header/edit2.png';
import BookDetailsModal from './BookDetailsModal';

const Book = (props) => {
    const {userDataState, dispatchUserData} = useContext(LoginContext);

    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
    const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
    const [isBookDetailsModalOpen, setIsBookDetailsModalOpen] = useState(false);
    const [isBookChecked, setIsBookChecked] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [bookWrapperClassList, setBookWrapperClassList] = useState('book-wrapper');
    const [isShowDeleteAndEditBookIcons, setIsShowDeleteAndEditBookIcons] = useState(false);

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
        setIsAddBookModalOpen(true);
        props.setIsBookAddedToCart(true);
        setIsButtonDisabled(true);
        addBookToCartInDB(bookName, userDataState.token)
        .then((res) => {
            dispatchUserData(addBookToCartAction(res.data.bookId, parseInt(res.data.quantity), parseFloat(res.data.totalPrice)));

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

    const onHoverShowDeleteAndEditIcons = () => {
        if (userDataState.user?.isAdmin) {
            setIsShowDeleteAndEditBookIcons(true);
        }
    }
    const onLeaveHoverHideDeleteAndEditIcons = () => {
        if (userDataState.user?.isAdmin) {
            setIsShowDeleteAndEditBookIcons(false);
        }
    }

    const adminDeleteBook = () => {
        setIsDeleteBookModalOpen(true);
    }
    const adminEditBook = () => {
        setIsEditBookModalOpen(true);
    }

    const showBookDetailsModal = (e) => {
        if (!e.target.classList?.value.includes('delete-icon-container') &&
            !e.target.classList?.value.includes('edit-icon-container') &&
            !e.target.classList?.value.includes('add-item-to-cart-icon')) {
            if (!isAddBookModalOpen && !isDeleteBookModalOpen && !isBookDetailsModalOpen) {
                setIsBookDetailsModalOpen(true);
            }
        }
    }

    return (
        <div>
            <div className={bookWrapperClassList} onMouseEnter={onHoverShowDeleteAndEditIcons} onMouseLeave={onLeaveHoverHideDeleteAndEditIcons} onClick={showBookDetailsModal}>
                {
                    isShowDeleteAndEditBookIcons &&
                    <div className="admin-icons-container">
                        <img src={deleteBookSymbol} alt="delete-book" className="delete-icon-container" onClick={adminDeleteBook}></img>
                        <img src={editBookSymbol} alt="edit-book" className="edit-icon-container" onClick={adminEditBook}></img>
                    </div>
                }
                <div className="book-image-container"><img src={`http://localhost:5000/books/image?name=${bookName}`} alt={bookName} className="book-image"></img></div>
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

            {isAddBookModalOpen && <GoToCheckoutModal setIsAddBookModalOpen={setIsAddBookModalOpen} />}
            {isDeleteBookModalOpen && <DeleteBookModal setIsDeleteBookModalOpen={setIsDeleteBookModalOpen} bookName={bookName} />}
            {isEditBookModalOpen && <EditBookModal setIsEditBookModalOpen={setIsEditBookModalOpen} bookId={props.book._id} bookName={bookName} />}
            {isBookDetailsModalOpen && <BookDetailsModal setIsBookDetailsModalOpen={setIsBookDetailsModalOpen} book={props.book} />}
        </div>
    )
}

export default Book;