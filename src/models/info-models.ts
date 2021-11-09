import mongoose from 'mongoose';
import { CoinSchema, Coin } from '@cryptograph-app/shared-models';

const CoinModel = mongoose.model<Coin>('coin', CoinSchema);

export { CoinModel };
