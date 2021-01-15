import React, { useContext } from 'react';
import BooksContextProvider from '../../context/booksContext';
import BooksLists from './BooksLists';

const BooksSectionLoader = () => {
    return (
        <BooksContextProvider>
            <BooksLists />
        </BooksContextProvider>
    )
}

export default BooksSectionLoader;