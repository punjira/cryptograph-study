/**
 * nats client api
 */

import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

export const TREND_UPDATE_EVENT = 'TREND_EVENT';
export const EXCHANGE_UPDATE_EVENT = 'EXCHANGE_UPDATE';
export const CANDLESTICK_EVENT = 'CANDLE_STICK_EVENT';
export const INDICATOR_EVENT = 'INDICATOR_EVENT';
export const NEW_CANDLE_EVENT = 'NEW_CANDLESTICK_UPDATE_EVENT';
export const EXCHANGE_LIST_REPLY = 'EXCHANGE_LIST_REPLY';
export const EXCHANGE_LIST_REQUEST = 'EXCHANGE_LIST_REQUEST';
export const COIN_INFO_LIST_REQUEST = 'COIN_INFO_LIST_REQUEST';
export const COIN_INFO_LIST_REPLY = 'COIN_INFO_LIST_REPLY';
export const NEW_SIGNAL_EVENT = 'NEW_SIGNAL_EVENT';

export const natsClient = (function () {
     console.log('creating nats client');
     class NatsClient {
          stan: nats.Stan;
          constructor() {
               this.stan = nats.connect(
                    process.env.NATS_CHANNEL,
                    randomBytes(4).toString('hex'),
                    {
                         url: process.env.NATS_URL,
                    }
               );
          }
          getClient() {
               return this.stan;
          }
          publishMessage(topic, message) {
               this.stan.publish(topic, JSON.stringify(message), () => {
                    // do logging
               });
          }
     }
     let instance: NatsClient;
     return {
          getInstance: () => {
               if (!instance) {
                    instance = new NatsClient();
               }
               return instance;
          },
     };
})();
