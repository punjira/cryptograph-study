import { Message } from 'node-nats-streaming';
import { Exchange } from '@cryptograph-app/shared-models';
import {
     removeAssetTrend,
     updateAssetTrend,
} from '../controllers/trend.controllers';
import {
     CANDLESTICK_EVENT,
     EXCHANGE_UPDATE_EVENT,
     INDICATOR_EVENT,
     natsClient,
     NEW_CANDLE_EVENT,
     TREND_UPDATE_EVENT,
} from './nat-helper';
import { insertCandlestick } from '../controllers/candlestick-controller';
import {
     createCandlestickObject,
     createIndicatorObject,
     createPriceFromCandlestick,
} from '../helpers/data-convertors';
import { insertIndicator } from '../controllers/indicator-controller';
import { upsertPrice } from '../controllers/price-controller';
import { logger, LOG_LEVELS } from '../../winston';
import { createExchanges } from '../controllers/exchange-controller';

export interface TrendUpdateMessage {
     key: string;
     status: number;
     details?: {
          dir: string;
          strength: boolean;
          started: number;
          dollar_volume: number;
     };
}

export interface CandlestickUpdateMessage {
     key: string;
     pattern: string;
     location: number;
     interval: string;
     direction: number;
}

export interface NewCandlestickEvent {
     ticker: string;
     data: number[];
}

export interface IndicatorUpdateMessage {
     key: string;
     base_indicator: string;
     type: string;
     interval: string;
     ticker: string;
     location: number;
}

natsClient
     .getInstance()
     .getClient()
     .on('connect', () => {
          const exchange_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(EXCHANGE_UPDATE_EVENT);
          exchange_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const exchanges: Exchange[] = JSON.parse(msg);
                    createExchanges(exchanges)
                         .then(() => {
                              logger(
                                   LOG_LEVELS.INFO,
                                   'local exchange list updated from nats with ' +
                                        exchanges.length +
                                        ' new data',
                                   'history-provider/nats/subscription.ts'
                              );
                         })
                         .catch((err) => {
                              logger(
                                   LOG_LEVELS.ERROR,
                                   'error writing incoming nats exchange list to local history-provider database Error: ' +
                                        err,
                                   'history-provider/nats/subscription.ts'
                              );
                         });
               }
          });
          const trend_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(TREND_UPDATE_EVENT);
          trend_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const data: TrendUpdateMessage = JSON.parse(msg);
                    if (data.status) {
                         //keep it async, this might introduce side effects by fixing it \
                         // by awaiting this action is not the answer \
                         // try setting up a flow for sequence id @todo
                         updateAssetTrend(data);
                    } else {
                         removeAssetTrend(data);
                    }
               }
          });
          /**
           * we need the latest and only the latest candlestick for each ticker.
           */
          const candle_update_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(NEW_CANDLE_EVENT);
          candle_update_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const parsed: NewCandlestickEvent = JSON.parse(msg);
                    const priceObj = createPriceFromCandlestick(parsed);
                    upsertPrice(priceObj)
                         .then((d) => {})
                         .catch((err) => {
                              logger(
                                   LOG_LEVELS.ERROR,
                                   'error while updating streamed price, Error: ' +
                                        err,
                                   'study/nats/sbscription.ts __candle_update_subscription'
                              );
                         });
               }
          });
          const candlestick_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(CANDLESTICK_EVENT);
          candlestick_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const parsed: CandlestickUpdateMessage[] = JSON.parse(msg);
                    for (let one of parsed) {
                         insertCandlestick(createCandlestickObject(one));
                    }
               }
          });
          const indicator_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(INDICATOR_EVENT);
          indicator_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const parsed: IndicatorUpdateMessage[] = JSON.parse(msg);
                    for (let one of parsed) {
                         insertIndicator(createIndicatorObject(one));
                    }
               }
          });
     });
