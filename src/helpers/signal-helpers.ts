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
