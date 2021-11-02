import mongoose from 'mongoose';
import { Direction } from './candlestick-pattern-model';

export interface Indicator {
     location: number;
     base_indicator: string;
     details?: string;
     redis_key: string;
     ticker: string;
     interval: string;
     direction?: Direction;
}

const indicatorSchema = new mongoose.Schema<Indicator>({
     location: {
          type: Number,
          required: true,
     },
     base_indicator: {
          type: String,
          required: true,
     },
     details: {
          type: String,
          required: false,
     },
     redis_key: {
          type: String,
          required: true,
     },
     ticker: {
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
          required: false,
          default: Direction.both,
     },
});

const IndicatorModel = mongoose.model<Indicator>('indicator', indicatorSchema);

export { IndicatorModel };
