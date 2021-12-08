if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const express = require("express");
const consola = require("consola");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
    res.send("Beta server");
})

server.all("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

const port = process.env.PORT || 8080;

const keepAlive = () => {
    server.listen(port, () => {
        consola.ready({
            message: `Server started on port ${port}`,
            badge: true
        });
    })
};

module.exports = keepAlive;