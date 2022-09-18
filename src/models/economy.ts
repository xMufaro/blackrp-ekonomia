import mongoose from "mongoose";

interface EconomyModel {
    userId: string;
    wallet: number;
    bank: number;
    cooldowns: {
        work: Date;
        daily: Date;
        beg: Date;
        rob: Date;
    }
}

const schema = new mongoose.Schema<EconomyModel>({
    userId: { type: String, required: true },
    wallet: { type: Number, required: true, default: 0 },
    bank: { type: Number, required: true, default: 0 },
    cooldowns: {
        work: { type: Date, required: true, default: Date.now() },
        daily: { type: Date, required: true, default: Date.now() },
        beg: { type: Date, required: true, default: Date.now() },
        rob: { type: Date, required: true, default: Date.now() }
    }
});

export const Economy = mongoose.model<EconomyModel>("Economy", schema);