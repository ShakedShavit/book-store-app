const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, 'the path from the current directory');

const app = express();

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(bookRouter);

app.listen(port, () => {
   console.log('server connected, port:', port);
});
