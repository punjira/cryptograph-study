import express from 'express';
const router = express.Router();

import { getCandlesticks } from '../controllers/candlestick-controller';

router.get('/find', getCandlesticks);

export default router;
