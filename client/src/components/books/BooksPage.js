import React, { useContext, useEffect, useState } from 'react';
import { addBooksAction } from '../../actions/booksActions';
import { BooksContext } from '../../context/booksContext';
import { getAllBooksFromDB } from '../../server/db/book';
import Loader from '../main/Loader';
import BooksLists from './BooksLists';
import SearchBooks from './SearchBooks';
import SearchFilter from './SearchFilter';

const BooksPage = () => {
    const { booksState, booksDispatch } = useContext(BooksContext);
    
    const [booksToDisplay, setBooksToDisplay] = useState([]);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [shouldCloseFilterList, setShouldCloseFilterList] = useState(false);
    const [renderBooksList, setRenderBooksList] = useState(false );

    useEffect(() => {
        getAllBooksFromDB()
        .then((res) => {
            if (isComponentMounted) {
                booksDispatch(addBooksAction(res));
            }
        })
        .catch((err) => {
            console.log(err);
        });

        return () => {
            setIsComponentMounted(false);
        }
    }, []);

    useEffect(() => {
        if (isComponentMounted) {
            setBooksToDisplay(booksState);
        }
    }, [booksState]);

    const closeFilterInSearchFilter = (e) => {
        if (!e.target.classList.value.includes('filter')) {
            setShouldCloseFilterList(true);
        }
    }

    return (
        <div onClick={closeFilterInSearchFilter}>
            <div className="search-section">
                <SearchBooks setBooksToDisplay={setBooksToDisplay} />
                <SearchFilter
                booksToDisplay={booksToDisplay}
                setBooksToDisplay={setBooksToDisplay}
                shouldCloseFilterList={shouldCloseFilterList}
                setShouldCloseFilterList={setShouldCloseFilterList}
                renderBooksList={renderBooksList}
                setRenderBooksList={setRenderBooksList}
                />
            </div>
            <BooksLists books={booksToDisplay} renderBooksList={renderBooksList} />

            {
                booksState.length === 0 &&
                <Loader />
            }
        </div>
    )
};

export default BooksPage;