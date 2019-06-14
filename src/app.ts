import express from 'express';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import {MONGODB_URI} from './util/secrets';

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as flowerController from './controllers/flower';
// Create Express server
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URI + '', {useNewUrlParser: true})
    .then(() => console.log('Connected to Mongo.'))
    .catch((err: any) => console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err));

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/flowers/all', flowerController.getAll);
app.post('/flowers/add', flowerController.add);
app.get('/flowers/:name', flowerController.get);


export default app;
