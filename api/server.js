const express = require ('express');
const helmet = require ('helmet');
const cors = require ('cors');

const apiRouter = require ('./apiRouter.js');
const actionsRouter = require ('../routes/actionsRouter');
const projectsRouter = require ('../routes/projectsRouter');

const server = express ();
server.use (cors ());

server.use (helmet ());

server.use (express.json ());
server.use(logger);
server.use(echo)

server.use ('/api', apiRouter);
server.use ('/actions', actionsRouter);
server.use ('/projects', projectsRouter);

function logger (req, res, next) {
    console.log(`${req.method} to ${req.originalUrl} from ${req.hostname}`);
    next();
}
function echo (req, res, next) {
  console.log(`Body: ${req.body} \nParams:${req.params}`);
  next()
}

module.exports = server;