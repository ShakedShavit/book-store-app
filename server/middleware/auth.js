const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findOne({
            _id: data._id,
            "tokens.token": token
        });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch(err) {
        res.status(400).send({
            status: 400,
            message: "not authenticated"
        });
    }
};

module.exports = auth;