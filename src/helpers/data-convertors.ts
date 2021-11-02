import { Candlestick } from '../models/candlestick-model';
import { Indicator } from '../models/indicator-model';
import { Price } from '../models/price-model';
import {
     CandlestickUpdateMessage,
     IndicatorUpdateMessage,
     NewCandlestickEvent,
} from '../nats/sbscription';

export function createCandlestickObject(
     data: CandlestickUpdateMessage
): Candlestick {
     return {
          direction: data.direction,
          interval: data.interval,
          redis_key: data.key,
          pattern: data.pattern,
          location: data.location,
     };
}

export function createIndicatorObject(data: IndicatorUpdateMessage): Indicator {
     return {
          base_indicator: data.base_indicator,
          interval: data.interval,
          location: data.location,
          redis_key: data.key,
          ticker: data.ticker,
          details: data.type,
     };
}

export function createPriceFromCandlestick(candle: NewCandlestickEvent): Price {
     return {
          date: candle.data[0],
          ticker: candle.ticker.split('-')[0],
          price: (candle.data[1] + candle.data[4]) / 2,
     };
}
