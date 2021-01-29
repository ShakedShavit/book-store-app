import React from 'react';

const BookDetailsModal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsBookDetailsModalOpen(false);
    }

    return (
        <div className="modal-container" onClick={closeModalButton}>
            <div className="modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>

                <div className="book-details-modal">
                    <img src={`http://localhost:5000/books/image?name=${props.book.name}`}></img>
                    <div>Name: <b>{props.book.name}</b></div>
                    <div>Author: <b>{props.book.author}</b></div>
                    <div>Price: <b>{props.book.price}</b></div>
                    <div>Summary: <b>{props.book.summary}</b></div>
                </div>

                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button grey-button" onClick={closeModal}>Close</span>
                </div>
            </div>
        </div>
    )
};

export default BookDetailsModal;