import React, { createContext, useReducer } from 'react';
import booksReducer, { initialBooksState } from '../reducers/booksReducer';

export const BooksContext = createContext();

const BooksContextProvider = (props) => {
    const [booksState, booksDispatch] = useReducer(booksReducer, initialBooksState);

    return (
        <BooksContext.Provider value={ { booksState, booksDispatch } }>
            { props.children }
        </BooksContext.Provider>
    );
}

export default BooksContextProvider;