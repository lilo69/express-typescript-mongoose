import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import methodOverride from 'method-override';
import { MONGODB_URI, SESSION_SECRET } from './config/secrets';
import apiRoutes from './routes';
import logger from './config/logger';
import httpStatus from 'http-status';
import cors from 'cors';

const MongoStore = mongo(session);

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected db');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    logger.error(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
  })
);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use('/api/v1/webapp', apiRoutes);

app.use(methodOverride());

// error handler, send stacktrace only during development
app.use(
  (
    err: {
      message: string;
      httpStatusCode: number;
    },
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (err.httpStatusCode) {
      res.status(err.httpStatusCode).json({
        success: false,
        message: err.message,
        data: null,
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.toString(),
        data: null,
      });
    }
  }
);

export default app;
