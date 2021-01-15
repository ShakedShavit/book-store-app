export const addBookToCartAction = (bookId, quantity, totalPrice) => ({
    type: "ADD_BOOK_TO_CART",
    bookId,
    quantity,
    totalPrice
});

export const removeBookFromCartAction = (bookId, quantity, totalPrice) => ({
    type: "REMOVE_BOOK_FROM_CART",
    bookId,
    quantity,
    totalPrice
});