/**
 * a blueprint to all available candlestick pattern and their characteristics   \
 * note that this model is not intended for storing market patterns but the explanation   \
 * to all candlestick patterns for latter usage
 *
 * populated automatically on startup from config/candlestick-patterns.ts
 */
import mongoose from 'mongoose';

export enum Act {
     r = 'r',
     c = 'b',
     b = 'c',
}

export enum Direction {
     up = 1,
     both = 0,
     down = -1,
}

export interface CandlestickPattern {
     name: string;
     link?: string;
     watch?: string;
     act: Act;
     direction: Direction;
}

const candlestickPatternSchema = new mongoose.Schema<CandlestickPattern>({
     name: {
          type: String,
          required: true,
          unique: true,
     },
     link: {
          type: String,
          required: false,
     },
     watch: {
          type: String,
          required: false,
     },
     act: {
          type: String,
          enum: Act,
          required: true,
          default: Act.b,
     },
     direction: {
          type: Number,
          enum: Direction,
          required: true,
          default: Direction.both,
     },
});
