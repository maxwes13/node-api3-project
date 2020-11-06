const express = require('express');

const cors = require("cors")

const server = express();

const userRouter = require("./users/userRouter.js")
const postRouter = require("./posts/postRouter.js")

server.use(express.json())
server.use(cors())
server.use(logger)

server.use("/api/users", userRouter)
server.use("/api/posts", postRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});



function logger(req, res, next) {
  console.log({
    "Request method": req.method,
    "Request URL": req.url,
    "Timestamp": Date.now()
  })
  next()
}

module.exports = server;