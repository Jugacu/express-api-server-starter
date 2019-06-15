import mongoose from 'mongoose';
import {FlowerDocument} from './Flower';

export type GardenDocument = mongoose.Document & {
    name: string,
    flowers?: FlowerDocument[],
};

const GardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    flowers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flower'
        }
    ],
}, {timestamps: true});

export const Garden = mongoose.model<GardenDocument>('Garden', GardenSchema);
