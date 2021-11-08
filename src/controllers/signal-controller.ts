import { InternalServerError } from '@cryptograph-app/error-handlers';
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
