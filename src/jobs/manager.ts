import schedule from 'node-schedule';
import { studyQueue, tickerQueue } from './caller';

import { getAllExchanges } from '../controllers/exchange-controller';

const frames = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d'];

async function createInitialData() {
     for (let one of frames) {
          await tickerQueue(one);
     }
}

export const createStudySchedule = (async function () {
     await createInitialData();
     getAllExchanges().then((data) => {
          const m_1_j = schedule.scheduleJob('*/2 * * * *', () => {
               tickerQueue('1m');
          });
          const m_3_j = schedule.scheduleJob('*/4 * * * *', () => {
               tickerQueue('3m');
          });
          const m_5_j = schedule.scheduleJob('*/6 * * * *', () => {
               tickerQueue('5m');
          });
          const study = schedule.scheduleJob('*/1 * * * *', () => {
               console.log('running study');
               for (let one of frames) {
                    studyQueue(one);
               }
          });
     });
     return {
          clearAllJobs: () => {
               console.log('not implemented yet! sorry._.');
          },
     };
})();
