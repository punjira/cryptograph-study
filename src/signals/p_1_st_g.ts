/**
 *
 */
import { promisedGetTrendForAsset as d } from '../controllers/trend.controllers';
import { promisedGetLatestForTicker as e } from '../controllers/indicator-controller';
import { getLatestAvailablePrice as f } from '../controllers/price-controller';
import { promisedCandlestickOnInterval as g } from '../controllers/candlestick-controller';
import { createSignalObject as l } from '../helpers/signal-helpers';
import {
     reversal_negatives,
     reversal_positives,
} from '../helpers/candlestick-helper';
import { addSignal } from '../controllers/signal-controller';

function laps(_: number, c: number): number {
     return _ - c * 60000;
}

export default async function p1R(one: string, ol: string) {
     try {
          const m1 = one;
          const k = await d(m1, ol); // trend
          if (!k) return;
          if (k.started_at < 50) return;
          const i9 = await e(m1, ol, 'stochastic'); // indicator
          const i8 = await f(m1); // last price date
          if (!i9) return;
          if (!i8) return;
          if (laps(i8.date, 3) > i9.location) return;
          if (k.direction === 1 && i9.details === 'overbought') return;
          if (k.direction === -1 && i9.details === 'oversold') return;
          const hk2 = await g(m1, ol); // candlesticks
          const rt = hk2.filter((el) => {
               if (
                    laps(i8.date, 3) < el.location &&
                    el.direction === k.direction
               ) {
                    if (k.direction === 1) {
                         if (reversal_positives.includes(el.pattern)) {
                              return el;
                         }
                    } else {
                         if (reversal_negatives.includes(el.pattern)) {
                              return el;
                         }
                    }
               }
          });
          if (rt.length) {
               const m4 = l(
                    `${m1}-${ol}`,
                    i8.price,
                    i8.date,
                    k.direction === 1 ? 'long' : 'short',
                    'p_1_st_g',
                    rt.filter((el) => el._id)
               );
               await addSignal(m4);
          }
     } catch (err) {
          console.log('error while running standard process, Error: ', err);
     }
}
