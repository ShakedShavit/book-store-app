import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { removeBookAction } from '../../actions/booksActions';
import { BooksContext } from '../../context/booksContext';
import { LoginContext } from '../../context/loginContext';
import { deleteBookInDB } from '../../server/db/book';

const DeleteBookModal = (props) => {
    const { userDataState } = useContext(LoginContext);
    const { booksDispatch } = useContext(BooksContext);

    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsDeleteBookModalOpen(false)
    }

    const history = useHistory();

    const goToHomePage = (e) => {
        closeModal(e);
        history.push('/home');
    }

    const deleteBook = (e) => {
        closeModal(e);

        deleteBookInDB(props.bookName, userDataState.token)
        .then(() => {
            booksDispatch(removeBookAction(props.bookName));
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>
                <span className="modal-text">Are you sure you want to permanently delete <b>{props.bookName}</b></span>
                <div className="modal-buttons">
                    <span className="modal-button green-button" onClick={deleteBook}>Yes</span>
                    <span className="modal-button grey-button" onClick={goToHomePage}>No</span>
                </div>
            </div>
        </div>
    )
}

export default DeleteBookModal;