const express = require('express');
const Book = require('../models/book');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const isUserTheAdmin = require('../utils/isUserTheAdmin');

const router = express.Router();

router.get('/books/get', async (req, res) => {
    try {
        const book = await Book.findById(req.query.id);
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
        const isUserAdmin = isUserTheAdmin(req.user.isAdmin);
        if (!isUserAdmin) {
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

router.delete('/books/remove', auth, async (req, res) => {
    try {
        const isUserAdmin = isUserTheAdmin(req.user.isAdmin);
        if (!isUserAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }

        const bookName = req.query.bookName;
        const book = await Book.findOneAndDelete({ name: bookName });
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: 'Book not found'
            });
        }
        res.status(200).send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/books/one', auth, async (req, res) => {
    try {
        const isUserAdmin = isUserTheAdmin(req.user.isAdmin);
        if (!isUserAdmin) {
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

const fieldsArr = ["name", "image", "author", "price"];

router.patch('/books/edit', auth, async (req, res) => {
    try {
        const isUserAdmin = isUserTheAdmin(req.user.isAdmin);
        if (!isUserAdmin) {
            return res.send({
                status: 403,
                message: "Admin permissions denied"
            });
        }

        if (Object.keys(req.body).some(field => !fieldsArr.includes(field))) {
            return res.status(400).send({
                status: 400,
                message: "Field does not exist"
            });
        }
        const book = await Book.findOne({ name: req.query.bookName })
        if (!book) {
            return res.status(400).send({
                status: 404,
                message: "Book not found"
            });
        }

        for (let update in req.body) {
            book[update] = req.body[update];
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
    const isUserAdmin = isUserTheAdmin(req.user.isAdmin);
        if (!isUserAdmin) {
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
    res.status(400).save({ error: error.message });
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