import { Indicator, IndicatorModel } from '../models/indicator-model';

export function checkExistingIndicator(data: Indicator): Promise<boolean> {
     return new Promise((resolve, reject) => {
          IndicatorModel.find(
               {
                    ticker: data.ticker,
                    interval: data.interval,
                    location: data.location,
                    base_indicator: data.base_indicator,
                    details: data.details,
               },
               function (err, result) {
                    if (err) {
                         return reject(err);
                    }
                    return resolve(result.length ? false : true);
               }
          );
     });
}

export function insertIndicator(data: Indicator) {
     return new Promise((resolve, reject) => {
          checkExistingIndicator(data)
               .then((isThere) => {
                    if (isThere) {
                         IndicatorModel.create(data, function (err, res) {
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
                    return reject(err);
               });
     });
}

export function getIndicators(req, res, next) {
     const symbol = req.query.symbol;
     const interval = req.query.interval;
     const base_indicator = req.query.indicator;
     const details = req.query.type;
     let query: any = {};
     if (symbol) query.ticker = { $regex: symbol, $options: 'i' };
     if (interval) query.interval = interval;
     if (base_indicator) query.base_indicator = base_indicator;
     if (details) query.details = details;
     IndicatorModel.find(query)
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

export function promisedGetLatestForTicker(
     ticker: string,
     frame: string,
     base: string
): Promise<Indicator | null> {
     return new Promise((resolve, reject) => {
          IndicatorModel.find({
               ticker: ticker,
               interval: frame,
               base_indicator: base,
          })
               .sort({ location: -1 })
               .limit(1)
               .exec((err, res) => {
                    if (err) {
                         return reject(err);
                    }
                    return resolve(res && res.length ? res[0] : null);
               });
     });
}
