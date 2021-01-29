import React from 'react';
import { useHistory } from 'react-router-dom';

const GoToCheckoutModal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsAddBookModalOpen(false)
    }
    
    const history = useHistory();
    const goToHomePage = (e) => {
        closeModal(e);
        history.push('/home')
    }
    const goToCheckout = () => {
        history.push('/cart')
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>
                <span className="modal-text">Go to Checkout?</span>
                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button green-button" onClick={goToCheckout}>Yes</span>
                    <span className="modal-button grey-button" onClick={goToHomePage}>No</span>
                </div>
            </div>
        </div>
    )
}

export default GoToCheckoutModal;