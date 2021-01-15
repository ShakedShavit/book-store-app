import React from 'react';
import { useHistory } from 'react-router-dom';
import addBookSymbol from '../../images/books/add-book-symbol3.svg';

const Book = () => {
    const history = useHistory();

    const goToAddBookPage = () => {
        history.push('/admin/edit/books')
    }

    return (
        <div className="book-wrapper">
            <div className="empty-book-container" onClick={goToAddBookPage}>
                <img src={addBookSymbol} alt="add book" className="book-image"></img>
            </div>
        </div>
    )
}

export default Book;