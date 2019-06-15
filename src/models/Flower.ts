import mongoose from 'mongoose';

export type FlowerDocument = mongoose.Document & {
    name: string,
    description: string,
    pic: string
};

const FlowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    pic: {
        type: String,
        default: ''
    },
}, { timestamps: true });

export const Flower = mongoose.model<FlowerDocument>('Flower', FlowerSchema);
