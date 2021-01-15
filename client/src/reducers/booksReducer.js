// import { nanoid } from 'nanoid';

// export const initialBooksState = [{
//     bookImage: bookImage1,
//     bookName: 'Harry Potter and the Philosophers Stone',
//     authorName: 'J.K. Rowling',
//     price: 19.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage2,
//     bookName: 'Harry Potter and the Chamber of Secrets',
//     authorName: 'J.K. Rowling',
//     price: 24.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage3,
//     bookName: 'Harry Potter and the Prisoner of Azkaban',
//     authorName: 'J.K. Rowling',
//     price: 24.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage4,
//     bookName: 'Harry Potter and the Goblet of Fire',
//     authorName: 'J.K. Rowling',
//     price: 29.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage5,
//     bookName: 'Harry Potter and the Order of the Phoenix',
//     authorName: 'J.K. Rowling',
//     price: 29.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage6,
//     bookName: 'Harry Potter and the Half Blood Price',
//     authorName: 'J.K. Rowling',
//     price: 34.99,
//     id: nanoid()
// },
// {
//     bookImage: bookImage7,
//     bookName: 'Harry Potter and the Deathly Hallows',
//     authorName: 'J.K. Rowling',
//     price: 34.99,
//     id: nanoid()
// }];

export const initialBooksState = [];

const booksReducer = (booksState, action) => {
    switch (action.type) {
        case "ADD_BOOK":
            return [...booksState].push(action.book);
        case "ADD_BOOKS":
            return [...booksState].concat(action.books);
        case "REMOVE_BOOK":
            return [...booksState].filter((book) => book.id !== action.id);
         default:
            return [...booksState]
    }
}

export default booksReducer;