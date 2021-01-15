const mongoose = require('mongoose');
require('../db/mongoose');
const Book = require('./book');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        unique: true,
        required: true,
        minlength: 6,
        trim: true
    },
    cart: {
        books: [{
            type: mongoose.Types.ObjectId,
            ref: 'Book',
            required: true,
        }],
        totalPrice: {
            type: String,
            default: "0"
        }
    },
    // cart: {
    //     books: [{
    //         bookName: {
    //             type: String
    //         },
    //         quantity: {
    //             type: Number,
    //             default: 0
    //         }
    //     }],
    //     totalPrice: {
    //         type: String,
    //         default: "0"
    //     }
    // },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

// Hiding information
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // delete userObject.email;
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (usernameOrEmail, password) => {    
    let user = await UserModel.findOne({ username: usernameOrEmail });
    if (!user) {
        user = await UserModel.findOne({ email: usernameOrEmail });
        if (!user) throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.addBookToCart = async function(bookId) {
    const book = await Book.findById(bookId);
    const cart = this.cart;

    if (!book) {
        throw new Error('Unable to find book')
    }

    cart.books = cart.books.concat({ book });
    cart.totalPrice += book.price;

    return this.save();
};

userSchema.methods.removeBookFromCart = async function(bookId) {
    const book = await Book.findById(bookId);
    const cart = this.cart;

    if (!book) {
        throw new Error('Unable to find book')
    }

    cart.books = cart.books.filter((book) => book.ObjectId !== bookId);
    cart.totalPrice -= book.price;

    return this.save();
};

userSchema.methods.isUserAdmin = async function() {
    const user = this;

    // const isMatch = await bcrypt.compare(process.env.ADMIN_PASSWORD, user.password);
    // if (isMatch) return true;
    // else return ('Admin permissions denied');

    if (process.env.ADMIN_EMAIL === user.email) return true;
    else return ('Admin permissions denied');
};

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;