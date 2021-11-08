import mongoose from 'mongoose';
import { logger, LOG_LEVELS } from '../../winston';

export const MongoConenct = function (callback) {
     console.log('creating mongo db connection');
     mongoose.connect(`${process.env.MONGO_URL}`, {
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000,
          keepAlive: true,
          dbName: 'study',
     });
     const db = mongoose.connection;
     db.once('open', () => {
          console.log('connection to mongo db created');
          callback();
     });
     db.on('error', (err) => {
          logger(
               LOG_LEVELS.ERROR,
               'error connecting to database , error description: ' + err,
               'database/mongo.ts'
          );
     });
     db.on('disconnected', () => {
          console.log('mongo connection disconnected');
          mongoose.connect(`${process.env.MONGO_URL}`, {
               connectTimeoutMS: 30000,
               socketTimeoutMS: 30000,
               keepAlive: true,
               dbName: 'study',
          });
     });
     db.on('close', (thing) => {});
};
