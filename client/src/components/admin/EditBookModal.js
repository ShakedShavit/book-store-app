import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';
import { editBookInDB, uploadBookImageToDB } from '../../server/db/book';
import Loader from '../main/Loader';

const EditBookModal = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [isEditBookStarted, setIsEditBookStarted] = useState(false);

    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        if (!isEditBookStarted) props.setIsEditBookModalOpen(false)
    }

    const history = useHistory();

    const goToHomePage = (e) => {
        closeModal(e);
        if (!isEditBookStarted) history.push('/home');
    }

    const editBook = (e) => {
        e.preventDefault();

        setIsEditBookStarted(true);

        let changes = {};
        let isObjectEmpty = true;

        if (e.target[0].value !== '') {
            changes.name = e.target[0].value;
            isObjectEmpty = false;
        }
        if (e.target[1].value !== '') {
            changes.author = e.target[1].value;
            isObjectEmpty = false;
        }
        if (e.target[2].value !== '') {
            changes.price = parseFloat(e.target[2].value);
            isObjectEmpty = false;
        }
        if (e.target[3].value !== '') {
            changes.summary = e.target[3].value;
            isObjectEmpty = false;
        }

        if (e.target[4].value) {
            let fd = new FormData(e.target);
            uploadBookImageToDB(fd, props.bookName, userDataState.token)
            .then((result) => {
                if (!isObjectEmpty) {
                    editBookInDB(props.bookId, changes, userDataState.token)
                    .then((res) => {
                        setIsEditBookStarted(false);
                        closeModal(e);
                    })
                    .catch((err) => {
                        console.log(err);
                        setIsEditBookStarted(false);
                        closeModal(e);
                    })
                } else {
                    setIsEditBookStarted(false);
                    closeModal(e);
                }
            })
            .catch((error) => {
                console.log(error);

                if (!isObjectEmpty) {
                    console.log(changes)
                    editBookInDB(props.bookId, changes, userDataState.token)
                    .then((res) => {
                        setIsEditBookStarted(false);
                        closeModal(e);
                    })
                    .catch((err) => {
                        console.log(err);
                        setIsEditBookStarted(false);
                        closeModal(e);
                    })
                }
            });
        } else {
            if (!isObjectEmpty) {
                editBookInDB(props.bookId, changes, userDataState.token)
                .then((res) => {
                    setIsEditBookStarted(false);
                    closeModal(e);
                })
                .catch((err) => {
                    console.log(err);
                    setIsEditBookStarted(false);
                    closeModal(e);
                })
            }
        }
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <form className="form edit-book-form" onSubmit={editBook}>
                    <span><u>Edit Book:</u> <b>{props.bookName}</b></span>

                    <label>Name:</label>
                    <input type="text" name="book-name" placeholder="Name" />

                    <label>Author:</label>
                    <input type="text" name="book-author" placeholder="Author" />

                    <label>Price:</label>
                    <input type="number" step="0.01" name="book-price" placeholder="Price" />

                    <label>Summary:</label>
                    <textarea name="book-summary" placeholder="Summary" />

                    <label>Select image:</label>
                    <input type="file" name="bookImage" accept="image/*" />

                    <button type="submit">Edit Book</button>
                </form>

                <div className="modal-buttons">
                    <span className="modal-button grey-button" onClick={goToHomePage}>Cancel</span>
                </div>
            </div>

            {isEditBookStarted && <Loader />}
        </div>
    )
};

export default EditBookModal;