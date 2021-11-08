import axios, { AxiosResponse } from 'axios';
import { logger, LOG_LEVELS } from '../../winston';
import { insertCandlestick } from '../controllers/candlestick-controller';
import { getAllExchanges } from '../controllers/exchange-controller';
import { insertIndicator } from '../controllers/indicator-controller';
import {
     removeAssetTrend,
     updateAssetTrend,
} from '../controllers/trend.controllers';
import {
     createCandlestickObject,
     createIndicatorObject,
} from '../helpers/data-convertors';
import inv from '../signals/p_1_st_g';

const file_location = 'study/jobs/caller.ts';

export interface TrendUpdateMessage {
     key: string;
     status: 1;
     location: number;
     details?: {
          dir: string;
          strength: boolean;
          started: number;
          dollar_volume: number;
     };
}
interface TrendResponse {
     data?: TrendUpdateMessage;
}

export interface CandlestickUpdateMessage {
     key: string;
     pattern: string;
     location: number;
     interval: string;
     direction: number;
}

export interface IndicatorUpdateMessage {
     key: string;
     base_indicator: string;
     type: string;
     interval: string;
     ticker: string;
     location: number;
}

interface IndicatorResponse {
     data?: IndicatorUpdateMessage[];
}

interface CandlestickResponse {
     data?: CandlestickUpdateMessage[];
}

export async function trendPuppeteer(ticker, interval) {
     try {
          const data: AxiosResponse<TrendResponse> = await axios.get(
               process.env.TREND,
               {
                    params: {
                         ticker: ticker,
                         frame: interval,
                    },
               }
          );
          if (data.data?.data?.status) {
               await updateAssetTrend(data.data.data);
          } else {
               await removeAssetTrend(data.data.data);
          }
     } catch (err) {
          logger(
               LOG_LEVELS.ERROR,
               'error while getting trend event from python service, Error: ' +
                    err,
               'study/jobs/caller.ts'
          );
     }
}

export async function candlestickPatternPuppeteer(ticker, interval) {
     try {
          const data: AxiosResponse<CandlestickResponse> = await axios.get(
               process.env.CANDLESTICK,
               {
                    params: {
                         ticker,
                         frame: interval,
                    },
               }
          );
          if (data.data?.data && data.data.data.length) {
               for (let one of data.data.data) {
                    await insertCandlestick(createCandlestickObject(one));
               }
          }
     } catch (err: any) {
          logger(
               LOG_LEVELS.ERROR,
               'error while getting candlestick patterns from python service, Error:  ' +
                    err,
               'study/jobs/caller.ts'
          );
     }
}

async function indicatorPatternPuppeteer(ticker, interval) {
     try {
          const data: AxiosResponse<IndicatorResponse> = await axios.get(
               process.env.INDICATOR,
               {
                    params: {
                         ticker,
                         frame: interval,
                    },
               }
          );
          if (data.data?.data && data.data?.data.length) {
               for (let one of data.data.data) {
                    await insertIndicator(createIndicatorObject(one));
               }
          }
     } catch (err: any) {
          logger(
               LOG_LEVELS.ERROR,
               'error while getting indicator signals from python service, Error:  ' +
                    err,
               'study/jobs/caller.ts'
          );
     }
}

export async function tickerQueue(interval) {
     try {
          const exchange = await getAllExchanges();
          exchange.forEach(async (el) => {
               await trendPuppeteer(el.ticker, interval);
               await candlestickPatternPuppeteer(el.ticker, interval);
               await indicatorPatternPuppeteer(el.ticker, interval);
          });
     } catch (err: any) {
          logger(
               LOG_LEVELS.ERROR,
               'error while calling update events service, Error: ' + err,
               file_location + 'trendPuppeteer'
          );
     }
}

export async function studyQueue(interval: string) {
     try {
          const exchange = await getAllExchanges();
          exchange.forEach(async (el) => {
               await inv(el.ticker, interval);
          });
     } catch (err: any) {
          logger(
               LOG_LEVELS.ERROR,
               'error while calling study service, Error: ' + err,
               file_location + 'trendPuppeteer'
          );
     }
}
