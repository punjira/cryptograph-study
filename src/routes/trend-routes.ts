import express from 'express';
const router = express.Router();

import {
     getMarketSentiment,
     getTrendsForAsset,
     getAllTrends,
} from '../controllers/trend.controllers';

router.get('/sentiment', getMarketSentiment);
router.get('/all', getAllTrends);
router.get('/:symbol', getTrendsForAsset);

export default router;
