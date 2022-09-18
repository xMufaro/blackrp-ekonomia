import mongoose from 'mongoose';

export class StartDatabase {
    constructor() {
        this.start();
    }

    async start() {
        mongoose.Promise = global.Promise;
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
}