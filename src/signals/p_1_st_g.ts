/**
 *
 */
import { Exchange } from '@cryptograph-app/shared-models';
import { promisedGetTrendForAsset as d } from '../controllers/trend.controllers';
import { promisedGetLatestForTicker as e } from '../controllers/indicator-controller';
import { getLatestAvailableDate as f } from '../controllers/price-controller';
import { promisedCandlestickOnInterval as g } from '../controllers/candlestick-controller';
import {
     reversal_negatives,
     reversal_positives,
} from '../helpers/candlestick-helper';

export default async function p1R(hk: Exchange[], ol: string) {
     for (let one of hk) {
          const m1 = one.ticker;
          const k = await d(m1, ol);
          if (!k) continue;
          if (k.started_at < 50) return;
          const i9 = await e(m1, ol, 'stochastic');
          const i8 = await f(m1);
          const hk2 = await g(m1, ol);
          if (!i9) continue;
          if (!i8) continue;
          if (laps(i8, 3) > i9.location) continue;
          if (k.direction === 1 && i9.details === 'overbought') continue;
          if (k.direction === -1 && i9.details === 'oversold') continue;
          const rt = hk2.filter(
               (el) =>
                    (k.direction === 1
                         ? reversal_positives.includes[el.pattern]
                         : reversal_negatives.includes[el.pattern]) &&
                    el.direction == -1 * k.direction
          );
          console.log(rt, m1);
     }
     return;
}

function laps(_: number, c: number): number {
     return _ - c * 60000;
}
