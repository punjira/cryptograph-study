import express from 'express';
const router = express.Router();

import { getIndicators } from '../controllers/indicator-controller';

router.get('/find', getIndicators);

export default router;
