import React, { useContext } from 'react';
import { BooksContext } from '../../context/booksContext';
import searchIcon from '../../images/books/search.png';

const SearchBooks = (props) => {
    const { booksState } = useContext(BooksContext);

    const searchBooks = (e) => {
        const input = e.target.value.toLowerCase();

        props.setBooksToDisplay(booksState.filter((book) => {
            if (book.name.toLowerCase().includes(input)) return true;
            if (book.author.toLowerCase().includes(input)) return true;
            if (book.price.toLowerCase().includes(input)) return true;
        }));
    };

    return (
        <div className="search-input-container">
            <input className="search-input" placeholder="Search by name / author / price" onChange={searchBooks} />
            <img src={searchIcon} className="search-image"></img>
        </div>
    )
};

export default SearchBooks;