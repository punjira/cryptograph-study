import { Message } from 'node-nats-streaming';
import { Exchange } from '@cryptograph-app/shared-models';
import {
     EXCHANGE_LIST_REPLY,
     EXCHANGE_LIST_REQUEST,
     EXCHANGE_UPDATE_EVENT,
     natsClient,
     NEW_CANDLE_EVENT,
} from './nat-helper';
import { createPriceFromCandlestick } from '../helpers/data-convertors';
import { upsertPrice } from '../controllers/price-controller';
import { logger, LOG_LEVELS } from '../../winston';
import { createExchanges } from '../controllers/exchange-controller';

export interface NewCandlestickEvent {
     ticker: string;
     data: number[];
}

export function createSubscriptions() {
     console.log('waiting for nats client to connect');
     natsClient
          .getInstance()
          .getClient()
          .on('connect', () => {
               natsClient
                    .getInstance()
                    .getClient()
                    .publish(EXCHANGE_LIST_REQUEST);
               console.log('nats connection created, creating subscriptions');
               const exchange_reply_subscriptions = natsClient
                    .getInstance()
                    .getClient()
                    .subscribe(EXCHANGE_LIST_REPLY);
               exchange_reply_subscriptions.on(
                    'message',
                    (message: Message) => {
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
                    }
               );
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
          });
}
