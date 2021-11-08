import express from 'express';
const router = express.Router();

import { getSignals } from '../controllers/signal-controller';

router.get('/find', getSignals);

export default router;
