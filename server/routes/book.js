const express = require('express');
const Book = require('../models/book');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = express.Router();

router.get('/books/get', async (req, res) => {
    try {
        const book = await Book.findById(req.query.bookId);
        if (!book) {
            return res.send({
                status: 404,
                message: "Book not found"
            });
        }
        res.status(201).send(book);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/books/get-all', async (req, res) => {
    try {
        const books = await Book.find({});
        if (!books) {
            return res.send({
                status: 404,
                message: "No books found"
            });
        }
        
        res.status(201).send([ ...books ]);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/books/register', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }
        
        const book = new Book(req.body);
        book.save();

        res.status(201).send({ book });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/books/delete', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }

        const bookName = req.body.params.bookName;

        const book = await Book.findOne({ name: bookName });
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: 'Book not found'
            });
        }
        const bookId = book._id.toString();
        const bookPrice = parseFloat(book.price);

        const allUsers = await User.find({});
        for (user of allUsers) {
            let totalPrice = parseFloat(user.cart.totalPrice);
            user.cart.books = user.cart.books.filter((book) => {
                if (book.toString() === bookId) {
                    totalPrice -= bookPrice;
                    return false;
                }
                return true;
            })
            user.cart.totalPrice = totalPrice.toString();
            await user.save();
        }

        await Book.findOneAndDelete({ name: bookName });

        res.status(200).send({ book, allUsers });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/books/one', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }

        const book = await Book.findOne();
        if (!book) {
            return res.send({
                status: 404,
                message: 'Book not found'
            });
        }

        res.status(200).send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

// const fieldsArr = ["name", "image", "author", "price", "summary"];
// const fieldsArr = ["author", "price", "summary"];
const fieldsArr = ["name", "author", "price", "summary"];

router.patch('/books/edit', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }

        if (Object.keys(req.body.params.changes).some(field => !fieldsArr.includes(field))) {
            return res.status(400).send({
                status: 400,
                message: "Field does not exist"
            });
        }

        const book = await Book.findById(req.body.params.bookId)
        if (!book) {
            return res.status(400).send({
                status: 404,
                message: "Book not found"
            });
        }

        for (let update in req.body.params.changes) {
            book[update] = req.body.params.changes[update];
        }
        
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    }
});


router.post('/books/image', auth, upload.single('bookImage'), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.send({
            status: 403,
            message: "Admin permissions denied"
        });
    }

    const book = await Book.findOne({ name: req.query.name });
    if (!book) {
        return res.status(400).send({
            status: 404,
            message: "Book not found"
        });
    }

    const buffer = await sharp(req.file.buffer).png().toBuffer();
    book.image = buffer;
    await book.save();
    res.send();
}, (error, req, res, next) => {
    console.log(error.message)
    res.status(400).send({ error: error.message });
});

router.get('/books/image', async (req, res) => {
    try {
        const book = await Book.findOne({ name: req.query.name });
        if (!book || !book.image) {
            throw new Error('Book or image not found');
        }

        res.set('Content-Type', 'image/png');
        res.send(book.image);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;