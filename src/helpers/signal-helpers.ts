import { ObjectId } from 'mongoose';
import { Signal } from '../models/signal-model';
import { createHash } from 'crypto';

export function createSignalObject(
     key: string,
     price: number,
     date: number,
     direction: string,
     name: string,
     candlesticks: ObjectId[],
     coin: ObjectId
): Signal {
     const signal_key = createSignalKey(key, name, direction, candlesticks);
     return {
          key,
          ticker: key.split('-')[0],
          interval: key.split('-')[1],
          at_price: price,
          location: date,
          direction: direction,
          name,
          candlesticks: candlesticks,
          signal_key,
          coin,
     };
}

export const frameMap = {
     '1m': 60000,
     '3m': 180000,
     '5m': 300000,
     '15m': 900000,
     '30m': 1800000,
     '1h': 3600000,
     '2h': 7200000,
     '4h': 14400000,
     '1d': 86400000,
};

export function getLocationThreshold(interval: string, threshold: number = 5) {
     return +new Date() - threshold * frameMap[interval];
}

export function createSignalKey(
     key: string,
     name: string,
     direction: string,
     candleSticks: ObjectId[]
): string {
     let signal = `${name}${key}${direction}`;
     for (let one of candleSticks) {
          signal = signal + one;
     }
     return createHash('sha256').update(signal).digest('base64');
}
