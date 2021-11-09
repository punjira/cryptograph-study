import { InternalServerError } from '@cryptograph-app/error-handlers';
import { frameMap, getLocationThreshold } from '../helpers/signal-helpers';
import { Signal, SignalModel } from '../models/signal-model';

export function addSignal(data: Signal) {
     return new Promise((resolve, reject) => {
          SignalModel.create(data, function (err, res) {
               if (err) {
                    return reject(err);
               }
               return resolve(res);
          });
     });
}

export function getSignals(req, res, next) {
     SignalModel.find()
          .populate('candlesticks')
          .exec(function (err, result) {
               if (err) {
                    throw new InternalServerError();
               }
               return res.status(200).json({
                    data: result,
               });
          });
}

export function promisedGetSignals(
     ticker?: string,
     interval?: string,
     name?: string
): Promise<Signal[]> {
     return new Promise((resolve, reject) => {
          SignalModel.find({}, function (err, res) {
               if (err) {
                    return reject(err);
               }
               return resolve(res);
          });
     });
}

export function getLiveSignals(req, res, next) {
     const symbol = req.query.symbol;
     const interval = req.query.interval;
     const signal = req.query.signal;
     let query: any = {};
     if (symbol) query.redis_key = { $regex: symbol, $options: 'i' };
     if (interval) query.interval = interval;
     if (signal) query.name = signal;
     if (interval) {
          SignalModel.find(query, function (err, result) {
               if (err) {
                    throw new InternalServerError();
               }
               return res.status(200).json({
                    data: result,
               });
          });
     }
     const promises = Object.keys(frameMap).map((el) => {
          return new Promise((resolve, reject) => {
               const nb = getLocationThreshold(el);
               SignalModel.find({ ...query, interval: el })
                    .where('location')
                    .gte(nb)
                    .exec(function (err, result) {
                         if (err) {
                              return reject(err);
                         }
                         resolve(result);
                    });
          });
     });
     Promise.all(promises)
          .then((data) => {
               const result = data.reduce((acc: Signal[], cur: Signal[]) => {
                    return acc.concat(cur);
               }, []);
               res.status(200).json({
                    data: result,
               });
          })
          .catch((err) => {
               throw new InternalServerError();
          });
}
