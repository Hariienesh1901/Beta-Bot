const express = require("express");
const consola = require("consola");

const server = express();

server.get("/", (req, res) => {
    res.send("Beta server");
})

server.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

const port = process.env.PORT || 3000;

const keepAlive = () => {
    server.listen(port, () => {
        consola.ready({
            message: "Server started on port 3000",
            badge: true
        });
    })
};

module.exports = keepAlive;