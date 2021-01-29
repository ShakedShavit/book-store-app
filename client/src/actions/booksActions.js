export const addBookAction = (book) => ({
    type: "ADD_BOOK",
    book
});

export const addBooksAction = (books) => ({
    type: "ADD_BOOKS",
    books
});

export const removeBookAction = (bookName) => ({
    type: "REMOVE_BOOK",
    bookName
});