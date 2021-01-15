import Axios from 'axios';

export const getBookFromDB = async (bookId) => {
    try {
        const res = await Axios.get('http://localhost:5000/books/get', {
            params: { id: bookId }
        });
        return res;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Book not found');
        }
    };
}

export const getAllBooksFromDB = async () => {
    try {
        const res = await Axios.get('http://localhost:5000/books/get-all');
        return [ ...res.data ];
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('No books found');
        }
    };
}

// export const getBookImageFromDB = async (bookName) => {
//     try {
//         const res = await Axios.get('http://localhost:5000/books/image', {
//             params: {
//                 name: bookName
//             }
//         });
//         return res;
//     } catch (err) {
//         if (err.response.status === 404) {
//             throw new Error('Book or image not found');
//         }
//     };
// }