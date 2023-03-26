import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as createError from 'http-errors';
import {RouteDefinition} from './decorator/RouteDefinition';
import TaskController from './controller/TaskController';
// TODO: import controller
// cors options
const corsOptions ={
  origin: /localhost\:\d{4,5}$/i, // localhost any 4 digit port
  credentials: true, // needed to set and return cookies
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  methods: 'GET,PUT,POST,DELETE',
  maxAge: 43200, // 12 hours
};
// create express app
const app = express();

createConnection().then(async (connection) => {
// setup express app here
  app.use(bodyParser.json()); // enable body parser

  app.use(cors(corsOptions)); // enable CORS for all handlers
  app.options('*', cors(corsOptions));// add handler for pre-flight options request to ANY path

  [
    TaskController,
    // TODO: Add controllers
  ].forEach((controller) => {
    // eslint-disable-next-line new-cap
    const instance = new controller();
    const path = Reflect.getMetadata('path', controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
    routes.forEach((route) => {
      app[route.method.toLowerCase()](path+route.param, (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const result = instance[route.action]( req, res, next );
        if (result instanceof Promise) {
          result.then((result) => result !== null && result !== undefined ? res.send(result) : next() )
              .catch((err) => next(createError(500, err)) );
        } else if (result !== null && result !== undefined) res.json(result);
      });
    });
  });


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({status: err.status, message: err.message, stack: err.stack.split(/\s{4,}/)});
  });

  // start express server when db connection is up
  const port =3009;
  app.listen(port);
  console.log(`Express server has started on port ${port}. Open http://localhost:${port}/task to see results`);
}).catch((error) => console.log(error));


