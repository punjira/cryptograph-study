import { Signal } from '../models/signal-model';

export function createSignalObject(
     key: string,
     price: number,
     date: number,
     direction: string,
     name: string,
     candlesticks: any[]
): Signal {
     return {
          key,
          ticker: key.split('-')[0],
          interval: key.split('-')[1],
          at_price: price,
          location: date,
          direction: direction,
          name,
          candlesticks: candlesticks,
     };
}
