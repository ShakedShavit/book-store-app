import React, { useContext } from 'react';
import BooksContextProvider from '../../context/booksContext';
import BooksPage from './BooksPage';

const BooksSectionLoader = () => {
    return (
        <BooksContextProvider>
            <BooksPage />
        </BooksContextProvider>
    )
}

export default BooksSectionLoader;