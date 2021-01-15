// import Cookies from 'js-cookie';

// const BOOKS_DATA = "books-data";

// export const saveBooksOnCookie = (booksData) => {
//     const jsonBooksData = JSON.stringify(booksData);
//     Cookies.set(BOOKS_DATA, jsonBooksData, { expires: 1/24, sameSite: "strict" });
// };

// export const geBooksFromCookie = () => {
//     const jsonBooksData = Cookies.get(BOOKS_DATA);
//     if (jsonBooksData === undefined) return null;

//     return JSON.parse(jsonBooksData);
// };