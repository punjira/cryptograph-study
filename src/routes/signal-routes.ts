import express from 'express';
const router = express.Router();

import { getLiveSignals, getSignal } from '../controllers/signal-controller';

router.get('/find', getLiveSignals);
router.get('/:signal', getSignal);

export default router;
