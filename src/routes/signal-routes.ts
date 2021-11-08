import express from 'express';
const router = express.Router();

import { getLiveSignals } from '../controllers/signal-controller';

router.get('/find', getLiveSignals);

export default router;
