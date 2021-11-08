import mongoose from 'mongoose';

interface Trend {
     ticker: string;
     interval: string;
     redisKey: string;
     status: boolean;
     direction?: 1 | -1;
     strength?: boolean;
     started_at?: number;
     location: number;
     dollar_volume?: number;
}

const trendSchema = new mongoose.Schema<Trend>(
     {
          ticker: {
               type: String,
               required: true,
               unique: false,
          },
          location: {
               type: Number,
               required: true,
          },
          interval: {
               type: String,
               required: true,
               unique: false,
          },
          redisKey: {
               type: String,
               required: true,
               unique: true,
          },
          status: {
               type: Boolean,
               required: true,
          },
          direction: Number,
          strength: Boolean,
          started_at: Number,
          dollar_volume: Number,
     },
     { timestamps: true }
);

const TrendModel = mongoose.model<Trend>('trend', trendSchema);

export { TrendModel, Trend };
