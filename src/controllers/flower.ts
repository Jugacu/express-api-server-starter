import {NextFunction, Request, Response} from 'express';
import {Flower, FlowerDocument} from '../models/Flower';

/**
 * GET /flowers/all
 * Returns all flowers.
 */
export const getAll = (req: Request, res: Response) => {
    Flower.find({}, (err, flower: FlowerDocument[]) => {
        res.json(flower);
    });
};

/**
 * Get /flowers/:name
 * Returns a flower with a given name
 */

export const get = (req: Request, res: Response, next: NextFunction) => {
    Flower.find({
        name: req.params.name
    }, (err, flower: FlowerDocument[]) => {
        // Passes the error to the next middleware
        if (err) {
            return next(err);
        }

        // If there is no flower returns a notfound Error
        if (flower.length === 0) {
          return res.json({
              status: 'error',
              message: 'Not found'
          });
        }

        res.json(flower);
    });
};

/**
 * GET /flowers/add
 * Creates a new flower
 */
export const add = (req: Request, res: Response, next: NextFunction) => {
    req.assert('name', 'Flower name cannot be blank').notEmpty();

    // Error checking
    const errors = req.validationErrors();
    if (errors) {
        return res.json({
            status: 'error',
            message: errors
        });
    }

    // Creates the flower
    const flower = new Flower({
        name: req.body.name,
        description: req.body.desc,
        pic: req.body.pic
    });

    // And saves it
    flower.save((err) => {
        // Passes the error to the next middleware
        if (err) return next(err);
    });

    res.json({
        status: 'success'
    });
};