const router = require('express').Router();
const {StatusCodes} = require('http-status-codes');
const Game = require('../models/game');

function onError (res, err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message
    })
}

router.use(require('../middleware/validate-session'))

router.get('/all', (req, res) => {
    Game.findAll({ where: { owner_id: req.user.id } })
        .then(
            (games) => {
                res.status(StatusCodes.OK).json({
                    games,
                    message: "Data fetched."
                })
            },

            (err) => onError (res, err)
        )
})

router.get('/:id', (req, res) => {
    Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
        .then(
            (game) => {
                if (!game) {
                     res.status(StatusCodes.NOT_FOUND).json({
                        message: "Game Not Found"
                    })
                } else {
                    res.status(StatusCodes.OK).json({
                        game
                    })
                }

            },
            (err) => onError (res, err)
        )
})

router.post('/create', (req, res) => {
    Game.create({
        title: req.body.game.title,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    })
        .then(
            (game) => {
                res.status(StatusCodes.OK).json({
                    game,
                    message: "Game created."
                })
            },

            (err) => onError (res, err)
        )
})

router.put('/update/:id', (req, res) => {
    Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    },
        {
            where: {
                id: req.params.id,
                owner_id: req.user.id
            }
        })
        .then(
            (game) => {
                res.status(StatusCodes.OK).json({
                    game,
                    message: "Successfully updated."
                })
            },

            (err) => onError (res, err)

        )
})

router.delete('/remove/:id', (req, res) => {
    Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(
        (game) => {
            res.status(StatusCodes.OK).json({
                game,
                message: "Successfully deleted"
            })
        },

        (err) => onError (res, err)
    )
})

module.exports = router;