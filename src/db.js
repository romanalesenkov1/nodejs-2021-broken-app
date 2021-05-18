const Sequelize = require('sequelize');
require('dotenv').config();
                                // database username   password
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: 'postgres'
})

sequelize.authenticate().then(
    () => {
        console.log("Connected to DB");
    },

    (err) => {
        console.log(`Error: ${err}`);
    }
)

module.exports = sequelize;