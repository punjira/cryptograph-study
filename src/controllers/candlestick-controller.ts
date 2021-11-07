import { Candlestick, CandlestickModel } from '../models/candlestick-model';

export function checkExisting(data: Candlestick): Promise<boolean> {
     return new Promise((resolve, reject) => {
          CandlestickModel.findOne(
               {
                    pattern: data.pattern,
                    redis_key: data.redis_key,
                    location: data.location,
               },
               function (err, result) {
                    if (err) {
                         return reject(err);
                    }
                    if (result) return resolve(false);
                    return resolve(true);
               }
          );
     });
}

export function insertCandlestick(data: Candlestick): Promise<boolean> {
     return new Promise((resolve, reject) => {
          checkExisting(data)
               .then((isThere) => {
                    if (isThere) {
                         CandlestickModel.create(data, function (err, res) {
                              if (err) {
                                   return reject(err);
                              }
                              return resolve(true);
                         });
                    } else {
                         return resolve(false);
                    }
               })
               .catch((err) => {
                    reject(err);
               });
     });
}

export function getCandlesticks(req, res, next) {
     const symbol = req.query.symbol;
     const interval = req.query.interval;
     const pattern = req.query.pattern;
     let query: any = {};
     if (symbol) query.redis_key = { $regex: symbol, $options: 'i' };
     if (interval) query.interval = interval;
     if (pattern) query.pattern = pattern;
     CandlestickModel.find(query)
          .sort({ location: -1 })
          .exec(function (err, result) {
               if (err) {
                    return res.status(500).json({
                         data: err,
                    });
               }
               return res.status(200).json({
                    data: result,
               });
          });
}

export function promisedCandlestickOnInterval(
     ticker: string,
     interval: string
): Promise<Candlestick[] | null> {
     return new Promise((resolve, reject) => {
          CandlestickModel.find({
               redis_key: `${ticker}-${interval}`,
          })
               .sort({ location: -1 })
               .exec(function (err, res) {
                    if (err) {
                         return reject(err);
                    }
                    return resolve(res || null);
               });
     });
}
