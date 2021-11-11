/**
 * helper functions to create feed objects for all events
 */

import { Coin } from '@cryptograph-app/shared-models';
import { Signal } from '../models/signal-model';

export interface Feed {
     message: string;
     en_message: string;
     location: number;
     signal: string;
     coin: Coin;
     interval?: string;
     name: string;
}

const intervalMap: { [key: string]: string } = {
     '1m': 'یک دقیقه ای',
     '3m': 'سه دقیقه ای',
     '5m': 'پنج دقیقه ای',
     '15m': 'پانزده دقیقه ای',
     '30m': 'سی دقیقه ای',
     '1h': 'یک ساعته',
     '2h': 'دو ساعته',
     '4h': 'چهار ساعته',
     '1d': 'یک روزه',
};

export function createP1stgFeed(signal: Signal, coin: Coin): Feed {
     return {
          coin: coin,
          message: `فرصت ${
               signal.direction === 'long' ? 'خرید' : 'فروش'
          } جدید در نمودار ${intervalMap[signal.interval]} ${coin.name}`,
          en_message: ``,
          location: signal.location,
          interval: signal.interval,
          signal: signal.signal_key,
          name: 'p_1_st_g',
     };
}
