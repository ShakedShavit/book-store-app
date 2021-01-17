// import React from 'react';
// import { useHistory } from 'react-router-dom';

// const GoToCheckoutInner = (props) => {
//     // const closeModalButton = (e) => {
//     //     closeModal(e);
//     // }
//     // const modalClicked = (e) => {
//     //     e.stopPropagation();
//     // }
//     console.log(props)
//     const closeModal = (e) => {
//         if (e != undefined) e.preventDefault();
//         props.setIsModalOpen(false)
//     }

//     const history = useHistory();
//     const goToHomePage = (e) => {
//         closeModal(e);
//         history.push('/home')
//     }
//     const goToCheckout = () => {
//         history.push('/cart')
//     }

//     return (
//         // <div className="modal-container" onClick={closeModal}>
//         //     <div className="modal" onClick={modalClicked}>
//         //         <button className="close-modal" onClick={closeModalButton}>x</button>
//         <div>
//             <span onClick={goToHomePage}>Continue Shopping</span>
//             <span onClick={goToCheckout}>Go to Checkout</span>
//         </div>
//         //     </div>
//         // </div>
//     )
// }

// export default GoToCheckoutInner;