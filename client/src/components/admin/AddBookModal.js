import React, { useContext, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { registerBookInDB, uploadBookImageToDB } from '../../server/db/book';
import Loader from '../main/Loader';

const AddBookModal = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [isNameInputError, setIsNameInputError] = useState(false);
    const [isAuthorInputError, setIsAuthorInputError] = useState(false);
    const [isNumberInputError, setIsNumberInputError] = useState(false);
    const [isAddBookStarted, setIsAddBookStarted] = useState(false);

    const onSubmitAddBook = (e) => {
        e.preventDefault();

        if (e.target[0].value === '') setIsNameInputError(true);
        else if (isNameInputError) setIsNameInputError(false);

        if (e.target[1].value === '') setIsAuthorInputError(true);
        else if (isAuthorInputError) setIsAuthorInputError(false);

        if (e.target[2].value === '') setIsNumberInputError(true);
        else if (isNumberInputError) setIsNumberInputError(false);

        if (!isNameInputError && !isAuthorInputError && !isNumberInputError) {
            setIsAddBookStarted(true);
            registerBookInDB(e.target[0].value, e.target[1].value, e.target[2].value, e.target[3].value, userDataState.token)
            .then((res) => {
                if (e.target[4].value) {
                    let fd = new FormData(e.target);
                    uploadBookImageToDB(fd, e.target[0].value, userDataState.token)
                    .then((result) => {
                        props.setIsAddBookModalOpen(false);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
                else props.setIsAddBookModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    const nameInputChange = (e) => {
        if (e.target.value !== '' && isNameInputError) setIsNameInputError(false);
        else if (e.target.value === '' && !isNameInputError) setIsNameInputError(true);
    }
    const authorInputChange = (e) => {
        if (e.target.value !== '' && isAuthorInputError) setIsAuthorInputError(false);
        else if (e.target.value === '' && !isAuthorInputError) setIsAuthorInputError(true);
    }
    const priceInputChange = (e) => {
        if (e.target.value !== '' && isNumberInputError) setIsNumberInputError(false);
        else if (e.target.value === '' && !isNumberInputError) setIsNumberInputError(true);
    }

    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        if (!isAddBookStarted) props.setIsAddBookModalOpen(false);
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <form className="form" onSubmit={onSubmitAddBook}>
                    <h1>Add Book</h1>
                    <label>Select image:</label>
                    <input type="text" name="book-name" placeholder="Book's name" onChange={nameInputChange} />
                    {
                        isNameInputError &&
                        <span>Name cannot be empty!</span>
                    }

                    <label>Book's author:</label>
                    <input type="text" name="book-author" placeholder="Author" onChange={authorInputChange} />
                    {
                        isAuthorInputError &&
                        <span>Book's author input cannot be empty!</span>
                    }

                    <label>Book's price:</label>
                    <input type="number" step="0.01" name="book-price" placeholder="Price" onChange={priceInputChange} />
                    {
                        isNumberInputError &&
                        <span>Book's price input cannot be empty!</span>
                    }

                    <label>Book's summary:</label>
                    <textarea name="book-summary" placeholder="Summary" />

                    <label>Select image:</label>
                    <input type="file" name="bookImage" accept="image/*" />

                    <button>Add Book</button>
                </form>
            </div>

            {isAddBookStarted && <Loader />}
        </div>
    )
}

export default AddBookModal;