import express from 'express';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import cors from 'cors';
import {MONGODB_URI} from './util/secrets';

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as gardenController from './controllers/garden';

// Create Express server
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URI + '', {useNewUrlParser: true})
    .then(() => console.log('Connected to Mongo.'))
    .catch((err: any) => console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err));

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/gardens/all', gardenController.getAll);
app.post('/gardens/add', gardenController.add);
app.get('/gardens/:name', gardenController.get);
app.get('/gardens/byId/:id', gardenController.getById);


export default app;
