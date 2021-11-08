import { Price, PriceModel } from '../models/price-model';

export function upsertPrice(price: Price): Promise<boolean> {
     return new Promise((resolve, reject) => {
          PriceModel.updateOne(
               {
                    ticker: price.ticker,
               },
               price,
               { upsert: true },
               function (err, res) {
                    if (err) {
                         return reject(err);
                    }
                    /**
                     * after all, what could go wrong?
                     */
                    return resolve(true);
               }
          );
     });
}

export function getLatestAvailableDate(ticker: string): Promise<number | null> {
     return new Promise((resolve, reject) => {
          PriceModel.findOne(
               { ticker: ticker },
               { date: 1 },
               function (err, res) {
                    if (err) {
                         return reject(err);
                    }
                    return resolve(res?.date || null);
               }
          );
     });
}

export function getLatestAvailablePrice(ticker: string): Promise<Price | null> {
     return new Promise((resolve, reject) => {
          PriceModel.findOne({ ticker: ticker }, function (err, res) {
               if (err) {
                    return reject(err);
               }
               return resolve(res || null);
          });
     });
}
