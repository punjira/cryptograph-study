import { Message } from 'node-nats-streaming';
import {
     removeAssetTrend,
     updateAssetTrend,
} from '../controllers/trend.controllers';
import {
     CANDLESTICK_EVENT,
     CANDLE_UPDATE_EVENT,
     natsClient,
     TREND_UPDATE_EVENT,
} from './nat-helper';
import { insertCandlestick } from '../controllers/candlestick-controller';
import { createCandlestickObject } from '../helpers/data-convertors';

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

natsClient
     .getInstance()
     .getClient()
     .on('connect', () => {
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
          const candle_update_subscription = natsClient
               .getInstance()
               .getClient()
               .subscribe(CANDLE_UPDATE_EVENT);
          candle_update_subscription.on('message', (message: Message) => {
               // console.log(message.getSubject(), message.getData());
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
     });
