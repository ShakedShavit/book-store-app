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
    const [isBookAddedToCart, setIsBookAddedToCart] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);

    useEffect(() => {
        getAllBooksFromDB()
        .then((res) => {
            if (isComponentMounted) {
                booksDispatch(addBooksAction(res));
                setDidBooksStateUpdate(true);
            }
        })
        .catch((err) => {
            console.log(err);
        });

        return () => {
            setIsComponentMounted(false);
        }
    }, []);


    const addToCartImageInitialClassList = 'icon-container add-item-to-cart-button';
    const [addToCartImageClassList, setAddToCartImageClassList] = useState(addToCartImageInitialClassList + ' add-item-to-cart-button__enabled'); //

    useEffect(() => {
        if (isComponentMounted) {
            if (isBookAddedToCart) setAddToCartImageClassList(addToCartImageInitialClassList);
            else setAddToCartImageClassList(addToCartImageInitialClassList + ' add-item-to-cart-button__enabled');
        }
    }, [isBookAddedToCart]);

    return (
        <div className="books-section-container">
            {
               !!userDataState.user && userDataState.user.isAdmin && isLoadingFinished &&
               <EmptyBookFrame />
            }
            { didBooksStateUpdate && booksState.map((book, index) => {
                if (userDataState.user && userDataState.user.isAdmin && index === booksState.length - 1 && didBooksStateUpdate && !isLoadingFinished) setIsLoadingFinished(true);
                return (
                    <Book
                    key={book.name}
                    book={book}
                    setIsBookAddedToCart={setIsBookAddedToCart}
                    isBookAddedToCart={isBookAddedToCart}
                    addToCartImageClassList={addToCartImageClassList}
                    />
                )
            }) }
        </div>
    )
}

export default BooksLists;