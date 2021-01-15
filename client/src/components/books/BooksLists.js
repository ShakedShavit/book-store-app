import React, { useContext, useEffect, useState } from 'react';
import { BooksContext } from '../../context/booksContext';
import Book from './Book';
import EmptyBookFrame from './EmptyBookFrame';
import { getAllBooksFromDB } from '../../server/db/book';
import { addBooksAction } from '../../actions/booksActions';
import { LoginContext } from '../../context/loginContext';

const BooksLists = () => {
    const { userDataState } = useContext(LoginContext);
    const { booksState, booksDispatch } = useContext(BooksContext);

    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const [didBooksStateUpdate, setDidBooksStateUpdate] = useState(false);

    let mounted = true;

    useEffect(() => {
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

    useEffect(() => {
        if (!didBooksStateUpdate) setDidBooksStateUpdate(true);
    }, [booksState.length]);

    return (
        <div className="books-section-container">
            {
                !!userDataState.user && userDataState.user.isAdmin && isLoadingFinished &&
                <EmptyBookFrame />
            }
            { booksState.map((book, index) => {
                if (index === booksState.length - 1 && didBooksStateUpdate && !isLoadingFinished) setIsLoadingFinished(true);
                return (
                    <Book
                    key={book.name}
                    book={book}
                    /> )
            }) }
        </div>
    )
}

export default BooksLists;