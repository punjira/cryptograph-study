import mongoose from 'mongoose';

export interface TrendSnapshot {
     location: number;
     direction: -1 | 1 | 0;
}

export interface IndicatorSnapshot {
     location: number;
     base_indicator: string;
     details: string;
}

export interface Signal {
     location: number;
     ticker: string;
     interval: string;
     key: string;
     name: string;
     candlesticks?: mongoose.Schema.Types.ObjectId[];
     coin: mongoose.Schema.Types.ObjectId;
     direction: string;
     at_price: number;
     take_profit?: number;
     stop_loss?: number;
     c_score?: number;
     signal_key: string;
     trend: TrendSnapshot;
     indicators: IndicatorSnapshot[];
}

const SignalSchema = new mongoose.Schema<Signal>({
     location: {
          type: Number,
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
     key: {
          type: String,
          required: true,
     },
     name: {
          type: String,
          required: true,
     },
     candlesticks: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Candlesticks',
          },
     ],

     coin: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: 'coin',
     },
     direction: {
          type: String,
          required: true,
     },
     at_price: {
          type: Number,
          required: true,
     },
     take_profit: {
          type: Number,
          required: false,
     },
     stop_loss: {
          type: Number,
          required: false,
     },
     c_score: {
          type: Number,
          required: false,
     },
     signal_key: {
          required: true,
          type: String,
     },
     trend: {
          location: {
               type: Number,
               required: true,
          },
          direction: {
               type: Number,
          },
     },
     indicators: [
          {
               location: {
                    type: String,
                    required: true,
               },
               base_indicator: {
                    type: String,
                    required: true,
               },
               details: {
                    type: String,
                    required: true,
               },
          },
     ],
});

const SignalModel = mongoose.model<Signal>('Signal', SignalSchema);

export { SignalModel };
