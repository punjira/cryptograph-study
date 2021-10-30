import express from 'express';
const router = express.Router();

import {
     getMarketSentiment,
     getTrendsForAsset,
     getTrendsForTimeFrame,
} from '../controllers/trend.controllers';

router.get('/sentiment', getMarketSentiment);
router.get('/:symbol', getTrendsForAsset);

export default router;
