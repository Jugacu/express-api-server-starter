import mongoose from 'mongoose';

export type FlowerDocument = mongoose.Document & {
    name: string,
    description: string,
    pic: string
};

const FlowerSchema = new mongoose.Schema({
    name: String,
    description: String,
    pic: String,
}, { timestamps: true });

export const Flower = mongoose.model<FlowerDocument>('Flower', FlowerSchema);
