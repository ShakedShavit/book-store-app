const mongoose = require('mongoose');
require('../db/mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: Buffer,
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const BookModel = mongoose.model('BookModel', bookSchema);

module.exports = BookModel;