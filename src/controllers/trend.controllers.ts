import { InternalServerError } from '@cryptograph-app/error-handlers';
import { TrendModel, Trend } from '../models/trend-model';
import { TrendUpdateMessage } from '../nats/sbscription';

export function getTrendsForAsset(req, res, next) {
     const symbol = req.query.symbol;
     const interval = req.params.interval;
     TrendModel.find({}, function (err, result) {
          if (err) {
               throw new InternalServerError();
          }
          return res.status(200).json({
               data: result,
          });
     });
}

export function promisedGetTrendForAsset(ticker, interval): Promise<Trend> {
     return new Promise((resolve, reject) => {
          TrendModel.findOne(
               {
                    interval: interval,
                    ticker: { $regex: ticker, $options: 'i' },
               },
               function (err, res) {
                    if (err) {
                         reject(err);
                    }
                    return resolve(res);
               }
          );
     });
}

export function getTrendsForTimeFrame() {}

export function getMarketSentiment(req, res, next) {
     const interval = req.params.interval;
     TrendModel.find({ interval: interval || '1h' }, function (err, result) {
          if (err) {
               throw new InternalServerError();
          }
          const positive = result.reduce((ps, el) => {
               if (el.status && el.direction === 1) {
                    return ps + el.dollar_volume;
               }
               return ps;
          }, 0);
          const negative = result.reduce((ns, el) => {
               if (el.status && el.direction === -1) {
                    return ns + el.dollar_volume;
               }
               return ns;
          }, 0);
          const sum = negative + positive;
          let sentiment =
               negative > positive ? (negative * -1) / sum : positive / sum;
          return res.status(200).json({
               sentiment: sentiment,
          });
     });
}

export function updateAssetTrend(data: TrendUpdateMessage): Promise<Trend> {
     return new Promise((resolve, reject) => {
          const Obj: Trend = {
               ticker: data.key.split('-')[0],
               interval: data.key.split('-')[1],
               redisKey: data.key,
               status: data.status ? true : false,
          };
          if (data.details && data.status) {
               Obj.direction = data.details.dir === 'positive' ? 1 : -1;
               Obj.strength = data.details.strength;
               Obj.started_at = data.details.started;
               Obj.dollar_volume = data.details.dollar_volume;
          }
          TrendModel.updateOne(
               { redisKey: Obj.redisKey },
               Obj,
               { upsert: true },
               function (err, result) {
                    if (err) {
                         return reject(err);
                    }
                    return resolve(result);
               }
          );
     });
}

export function removeAssetTrend(data: TrendUpdateMessage): Promise<boolean> {
     return new Promise((resolve, reject) => {
          const redisKey = data.key;
          TrendModel.deleteOne({ redisKey }, function (err, result) {
               if (err) {
                    return reject(err);
               }
               return resolve(true);
          });
     });
}
