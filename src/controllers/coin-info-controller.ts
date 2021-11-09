import { Coin } from '@cryptograph-app/shared-models';
import { CoinModel } from '../models/info-models';

export function insetManyCoinInfos(data: Coin[]): Promise<void> {
     return new Promise((resolve, reject) => {
          CoinModel.insertMany(
               data,
               { ordered: false },
               function (err, result) {
                    if (err) {
                         return reject(err);
                    }
                    return resolve();
               }
          );
     });
}

export function getCoinInfo(ticker): Promise<any> {
     return new Promise((resolve, reject) => {
          CoinModel.findOne({ ticker }, function (err, res) {
               if (err) {
                    return reject(err);
               }
               resolve(res);
          });
     });
}
