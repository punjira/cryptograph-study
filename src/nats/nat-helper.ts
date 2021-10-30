/**
 * nats client api
 */

import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

export const TREND_UPDATE_EVENT = 'TREND_EVENT';
export const CANDLE_UPDATE_EVENT = 'CANDLE_UPDATE';
export const CANDLESTICK_EVENT = 'CANDLE_STICK_EVENT';

export const natsClient = (function () {
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
