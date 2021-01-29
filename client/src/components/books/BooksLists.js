import React, { useContext, useEffect, useState } from 'react';
import Book from './Book';
import EmptyBookFrame from './EmptyBookFrame';
import { LoginContext } from '../../context/loginContext';

const BooksLists = (props) => {
    const { userDataState } = useContext(LoginContext);

    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const [isBookAddedToCart, setIsBookAddedToCart] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);

    useEffect(() => {
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
            { props.books.map((book, index) => {
                if (userDataState.user && userDataState.user.isAdmin && index === props.books.length - 1 && !isLoadingFinished) setIsLoadingFinished(true);
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