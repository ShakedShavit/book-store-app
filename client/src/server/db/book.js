import Axios from 'axios';

export const getBookFromDB = async (bookId) => {
    try {
        const res = await Axios.get('/books/get', {
            params: { bookId }
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
        const res = await Axios.get('/books/get-all');
        return [ ...res.data ];
    } catch (err) {
        if (err.response?.status === 404) {
            throw new Error('No books found');
        }
    };
}

export const registerBookInDB = async (bookName, author, price, summary, token) => {
    try {
        const res = await Axios.post('/books/register', {
            name: bookName,
            author,
            price,
            summary
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Book registering failed');
        }
    };
}

export const uploadBookImageToDB = async (formData, bookName, token) => {
    try {
        const res = await Axios.post('/books/image', formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            params: {
                name: bookName
            }
        });

        return res.data;
    } catch (err) {
        if (err.response?.status === 404) {
            throw new Error('Book image upload failed');
        }
    };
}

export const deleteBookInDB = async (bookName, token) => {
    try {
        const res = await Axios.patch('/books/delete', {
            params: { bookName }
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('No books found');
        }
    };
}

export const editBookInDB = async (bookId, changes, token) => {
    try {
        const res = await Axios.patch('/books/edit', {
            params: { bookId, changes }
        }, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return res.data;
    } catch (err) {
        if (err.response.status === 404) {
            throw new Error('Book edit failed');
        }
    };
}

// export const getBookImageFromDB = async (bookName) => {
//     try {
//         const res = await Axios.get('/books/image', {
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