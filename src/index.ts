import { MongoConenct } from './database/mongo';
import { createStudySchedule } from './jobs/manager';
import { createSubscriptions } from './nats/sbscription';
import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
app.use(cors());
app.use(bodyParser({ extended: true }));

MongoConenct(() => {
     createStudySchedule;
     createSubscriptions();
});

import TrendRouter from './routes/trend-routes';
import CandlestickRouter from './routes/candlestick-routes';
import IndicatorRouter from './routes/indicator-routes';

app.use('/trend', TrendRouter);
app.use('/candlestick', CandlestickRouter);
app.use('/indicator', IndicatorRouter);

app.listen(process.env.PORT, () => {
     console.log('study server is up on port ,', process.env.PORT);
});
