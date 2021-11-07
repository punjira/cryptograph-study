import schedule from 'node-schedule';
import { tickerQueue } from './caller';

import { getAllExchanges } from '../controllers/exchange-controller';

export const createStudySchedule = (function () {
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
     });
     return {
          clearAllJobs: () => {
               console.log('not implemented yet! sorry._.');
          },
     };
})();
