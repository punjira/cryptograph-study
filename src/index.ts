require('./database/mongo');
require('./nats/sbscription');
import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
app.use(cors());
app.use(bodyParser({ extended: true }));

import TrendRouter from './routes/trend-routes';
import CandlestickRouter from './routes/candlestick-routes';

app.use('/trend', TrendRouter);
app.use('/candlestick', CandlestickRouter);

app.listen(process.env.PORT, () => {
     console.log('study server is up on port ,', process.env.PORT);
});
