import { Message } from 'node-nats-streaming';
import { Coin, Exchange } from '@cryptograph-app/shared-models';
import {
     COIN_INFO_LIST_REPLY,
     COIN_INFO_LIST_REQUEST,
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
import { insetManyCoinInfos } from '../controllers/coin-info-controller';

export interface NewCandlestickEvent {
     ticker: string;
     data: number[];
}

export function createSubscriptions() {
     console.log('waiting for nats client to connect');
     const client = natsClient.getInstance().getClient();
     client.on('connect', () => {
          console.log('nats connection created, creating subscriptions');
          client.publish(EXCHANGE_LIST_REQUEST);
          client.publish(COIN_INFO_LIST_REQUEST);
          const coin_info_reply_subscription =
               client.subscribe(COIN_INFO_LIST_REPLY);
          coin_info_reply_subscription.on('message', (message: Message) => {
               const msg = message.getData();
               if (typeof msg === 'string') {
                    const parsed: Coin[] = JSON.parse(msg);
                    insetManyCoinInfos(parsed)
                         .then(() => {
                              logger(
                                   LOG_LEVELS.INFO,
                                   'local coin list updated from nats with ' +
                                        parsed.length +
                                        ' new data',
                                   'history-provider/nats/subscription.ts'
                              );
                         })
                         .catch((err) => {
                              logger(
                                   LOG_LEVELS.ERROR,
                                   'error writing incoming nats coin list to local history-provider database Error: ' +
                                        err,
                                   'history-provider/nats/subscription.ts'
                              );
                         });
               }
          });
          const exchange_reply_subscriptions =
               client.subscribe(EXCHANGE_LIST_REPLY);
          exchange_reply_subscriptions.on('message', (message: Message) => {
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
