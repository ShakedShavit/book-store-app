import React, { useState } from 'react';
import addBookSymbol from '../../images/books/add-book-symbol6.png';
import AddBookModal from '../admin/AddBookModal';

const EmptyBookFrame = () => {
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

    const goToAddBookPage = () => {
        setIsAddBookModalOpen(true);
    }

    return (
        <div>
            <div className="book-wrapper">
                <div className="empty-book-container" onClick={goToAddBookPage}>
                    <img src={addBookSymbol} alt="add book" className="add-book-image"></img>
                </div>
            </div>
            {isAddBookModalOpen && <AddBookModal setIsAddBookModalOpen={setIsAddBookModalOpen} isAddBookModalOpen={isAddBookModalOpen} />}
        </div>
    )
}

export default EmptyBookFrame;