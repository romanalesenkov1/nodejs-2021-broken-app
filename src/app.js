const express = require('express');

const app = express();
const db = require('./db');
const user = require('./controllers/usercontroller')
const game = require('./controllers/gamecontroller')

app.use(express.json());

db.sync();

app.use('/api/auth', user);
app.use('/api/game', game);

app.listen(4000,() => {
    console.log("App is listening on 4000");
})