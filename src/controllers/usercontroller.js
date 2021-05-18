const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const User = require('../models/user');

router.post('/signup', (req, res) => {
    User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash: bcrypt.hashSync(req.body.user.password, 10),
        email: req.body.user.email,
    })
        .then(
            (user) => {
                const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                res.status(StatusCodes.OK).json({
                    user,
                    token
                })
            },

            (err) => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
            }
        )
})

router.post('/signin', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, (err, matches) => {
                if (matches) {
                    const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user,
                        message: "Successfully authenticated.",
                        sessionToken: token
                    });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).send({ error: "Passwords do not match." })
                }
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).send({ error: "User not found." })
        }

    })
})

module.exports = router;