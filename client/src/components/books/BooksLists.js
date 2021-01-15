import React, { useContext, useEffect } from 'react';
import { BooksContext } from '../../context/booksContext';
import Book from './Book';
import { getAllBooksFromDB } from '../../server/db/book';
import { addBooksAction } from '../../actions/booksActions';

const BooksLists = () => {
    const { booksState, booksDispatch } = useContext(BooksContext);

    useEffect(() => {
        let mounted = true;

        getAllBooksFromDB()
        .then((res) => {
            if (mounted) {
                booksDispatch(addBooksAction(res));
            }
        })
        .catch((err) => {
            console.log(err);
        });

        return () => mounted = false;
    }, [])

    return (
        <div className="books-section-container">
            {booksState.map((book) => (
                <Book
                key={book.name}
                book={book}
                />
            ))}
        </div>
    )
}

export default BooksLists;