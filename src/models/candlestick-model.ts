import mongoose from 'mongoose';
import { Direction } from './candlestick-pattern-model';

export interface Candlestick {
     location: number;
     pattern: string;
     redis_key: string;
     interval: string;
     direction: Direction;
}

const candleStickSchema = new mongoose.Schema<Candlestick>({
     location: {
          type: Number,
          required: true,
     },
     pattern: {
          type: String,
          required: true,
     },
     redis_key: {
          type: String,
          required: true,
     },
     interval: {
          type: String,
          required: true,
     },
     direction: {
          type: Number,
          enum: Direction,
          default: Direction.both,
          required: true,
     },
});

const CandlestickModel = mongoose.model<Candlestick>(
     'Candlesticks',
     candleStickSchema
);

export { CandlestickModel };
