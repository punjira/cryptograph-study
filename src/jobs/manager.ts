import schedule from 'node-schedule';
import shup from '../signals/p_1_st_g';

import { getAllExchanges } from '../controllers/exchange-controller';

export const createStudySchedule = (function () {
     getAllExchanges().then((data) => {
          const m_1_j = schedule.scheduleJob('*/10 * * * * *', () => {
               shup(data, '1m');
          });
          const m_3_j = schedule.scheduleJob('*/4 * * * *', () => {
               shup(data, '3m');
          });
          const m_5_j = schedule.scheduleJob('*/6 * * * *', () => {
               shup(data, '5m');
          });
     });
     return {
          clearAllJobs: () => {
               console.log('not implemented yet! sorry._.');
          },
     };
})();
