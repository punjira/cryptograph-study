import { Candlestick } from '../models/candlestick-model';
import { CandlestickUpdateMessage } from '../nats/sbscription';

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
