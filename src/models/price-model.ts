import mongoose from 'mongoose';

export interface Price {
     date: number;
     ticker: string;
     price: number;
}

const priceSchema = new mongoose.Schema<Price>({
     date: {
          type: Number,
          required: true,
     },
     ticker: {
          type: String,
          unique: true,
          required: true,
     },
     price: {
          type: Number,
          required: false,
     },
});

/**
 * maybe a helper func?, or not
 */

const PriceModel = mongoose.model<Price>('price', priceSchema);

export { PriceModel };
