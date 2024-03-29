const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(bookRouter);

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));

   app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
   });
}

app.listen(port, () => {
   console.log('server connected, port:', port);
});
