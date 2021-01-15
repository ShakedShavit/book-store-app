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
        props.setIsModalOpen(false)
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
        <div className="go-to-checkout__modal-container" onClick={closeModal}>
            <div className="go-to-checkout__modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>
                <span onClick={goToHomePage}>Continue Shopping</span>
                <span onClick={goToCheckout}>Go to Checkout</span>
            </div>
        </div>
    )
}

export default GoToCheckoutModal;