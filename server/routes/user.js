const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const Book = require('../models/book');
const isUserTheAdmin = require('../utils/isUserTheAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('API is working properly');
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// router.get('/users/is-admin', auth, async (req, res) => {
//     try {
//         const isUserAdmin = await req.user.isUserAdmin();
//         if (isUserAdmin !== true) {
//             return res.send(false);
//         }
//         res.status(200).send(true);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.post('/users/signup', async (req, res) => {
    const isUserAdmin = isUserTheAdmin(req.body.email);
    const user = new User({
        ...req.body,
        isAdmin: isUserAdmin
    });
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.usernameOrEmail, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await user.save();
        
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch('/users/add-book-to-cart', auth, async (req, res) => {
    try {
        const bookName = req.body.params.bookName;
        const book = await Book.findOne({ name: bookName });
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: 'Book not found',
            });
        }
        const quantity = req.body.params.quantity || 1;
        let quantityCounter = 0;
        let totalPrice = parseFloat(req.user.cart.totalPrice);
        let bookPrice = parseFloat(book.price);

        while (quantityCounter < quantity) {
            req.user.cart.books.push(book);
            quantityCounter++;
            totalPrice += bookPrice;
        }
        req.user.cart.totalPrice = totalPrice.toString();

        await req.user.save();
        res.send({ bookId: book._id, quantity: quantity, totalPrice });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/users/remove-book-from-cart', auth, async (req, res) => {
    try {
        const bookName = req.body.params.bookName;
        const book = await Book.findOne({ name: bookName });
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: 'Book not found',
            });
        }

        const quantity = req.body.params.quantity || 1;
        let quantityCounter = 0;
        let totalPrice = parseFloat(req.user.cart.totalPrice);
        let bookPrice = parseFloat(book.price);

        req.user.cart.books = req.user.cart.books.filter((bookInCart) => {
            if (book._id.toString() === bookInCart.toString() && quantityCounter < quantity) {
                quantityCounter++;
                totalPrice -= bookPrice;
                return false;
            }
            return true;
        });
        req.user.cart.totalPrice = totalPrice.toString();

        await req.user.save();
        res.send({ bookId: book._id, quantity: quantity, totalPrice });
    } catch (err) {
        res.status(400).send(err);
    }
});

const fieldsArr = ["username", "email", "password"];

router.patch('/users/edit', auth, async (req, res) => {
    try {
        if (Object.keys(req.body).some(field => !fieldsArr.includes(field))) {
            return res.status(400).send({
                status: 400,
                message: "Field does not exist"
            });
        }

        for (let update in req.body) {
            req.user[update] = req.body[update];
        }

        await req.user.save(); //calls the decrypting of the password
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;