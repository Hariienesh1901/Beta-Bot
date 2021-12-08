if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

const express = require("express");
const request = require("request");
const consola = require("consola");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
    res.send("Beta server");
})

server.post("/router", (req, res) => {
    const { url, method, headers, body } = req.body;

    const options = {
        method: "POST",
        url: "https://discord.com/api/webhooks/918056404932243476/MMHKSNdv-LH2IXsDXBZ4uRQx5OggUCbYWC0moQxb2XohF6p2rxrU1CUsKfMm8Gi5nB_V",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${url} ${method} ${headers} ${body}`
        }),

    };
});

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