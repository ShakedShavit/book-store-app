import React, { useContext, useEffect, useState } from 'react';
import { removeAllBooksFromCart } from '../../actions/userCartActions';
import { LoginContext } from '../../context/loginContext';
import { removeAllBookFromCartInDB } from '../../server/db/user';

const ConfirmPurchaseModal = (props) => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [purchaseModalText, setPurchaseModalText] = useState('Confirm Purchase?');

    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        props.setIsConfirmPurchaseModalOpen(false)
    }

    let isMounted = true;
    useEffect(() => {
        return () => isMounted = false;   
    }, []);

    const confirmPurchase = (e) => {
        if (userDataState.user.cart.books.length !== 0) {

            removeAllBookFromCartInDB(userDataState.token)
            .then((res) => {
                if (isMounted) {
                    setPurchaseModalText('Thank You for Your Purchase! Please Come Again');
                }
            })
            .catch((err) => {
                console.log(err);
                setPurchaseModalText('Payment Failed! Please Try Again');
            })
        }

        else {
            setPurchaseModalText('Cart is Empty!');
        }

        setTimeout(() => {
            dispatchUserData(removeAllBooksFromCart());
            if (isMounted) closeModal(e);
        }, 2500);
    }

    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModal}>x</button>
                <span className="modal-text">{purchaseModalText}</span>
                <div className="checkout-modal-buttons modal-buttons">
                    <span className="modal-button green-button" onClick={confirmPurchase}>Confirm</span>
                    <span className="modal-button grey-button" onClick={closeModal}>Go Back to Cart</span>
                </div>
            </div>
        </div>
    )
};

export default ConfirmPurchaseModal;