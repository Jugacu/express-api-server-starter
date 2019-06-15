import {NextFunction, Request, Response} from 'express';
import {Garden, GardenDocument} from '../models/Garden';
import {Flower, FlowerDocument} from '../models/Flower';

/**
 * GET /gardens/all
 * Returns all gardens.
 */
export const getAll = (req: Request, res: Response) => {
    Garden.find()
        // This is like an outer-join
        .populate('flowers', 'name pic description')
        .exec()
        .then((gardens: GardenDocument[]) => {
            res.status(200).json(gardens);
        })
        .catch((err) => {
            res.status(500).json({
                status: 'error',
                response: err
            });
        });
};

/**
 * Get /gardens/:name
 * Returns a garden with a given name
 */

export const get = (req: Request, res: Response, next: NextFunction) => {
    Garden
        .find({
            name: req.params.name
        })
        .populate('flowers')
        .exec()
        .then((gardens: GardenDocument[]) => {
            if (gardens.length === 0)
                return res.status(404).json({
                    status: 'error',
                    response: 'No gardens found.'
                });

            res.status(200).json(gardens);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                response: err
            });
        });
};

/**
 * GET /gardens/add
 * Creates a new garden
 */
export const add = (req: Request, res: Response, next: NextFunction) => {
    req.assert('name', 'Garden name cannot be blank').notEmpty();
    req.assert('flowers', 'Garden must have a flower array, it can be empty').isArray();

    // Error checking
    const errors = req.validationErrors();
    if (errors) {
        return res.status(401).json({
            status: 'error',
            response: errors
        });
    }

    // Stores all flower ids for later insertion
    let flowerIds: any = [];

    // Stores all the needed promises for later full fill
    const promises: Promise<any>[] = [];
    const nestedPromises: Promise<any>[] = [];

    // Loop through all flowers and if they doesn't exists it tries to create them with the data supplied and ads them to the flowerIds array.
    req.body.flowers.forEach((flower: FlowerDocument, index: number) => {
        promises.push(
            Flower
                .find({
                    name: flower.name
                })
                .exec()
                .then((flowers: FlowerDocument[]) => {
                    flowers.forEach(flower => {
                        flowerIds.push(flower._id);
                    });

                    if (flowers.length === 0) {
                        const newFlower = new Flower({
                            name: flower.name,
                            description: flower.description,
                            pic: flower.pic
                        });

                        nestedPromises.push(
                            newFlower.save()
                                .then(flower => {
                                    flowerIds.push(flower._id);
                                })
                        );
                    }

                })
        );

    });

    // Waits for all top promises to finish
    Promise.all(promises)
        .then(() => {
            // And then waits for all nested promises
            return Promise.all(nestedPromises);
        })
        .then(() => {
            // Now all ids are available for us so we can start creating the garden
            const garden = new Garden({
                name: req.body.name,
                flowers: flowerIds
            });

            return garden.save();
        })
        .then(garden => {
            res.status(201).json({
                status: 'success',
                created: garden
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                response: err
            });
        });
};