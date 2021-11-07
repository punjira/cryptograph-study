import { DatabaseConnectionError } from '@cryptograph-app/error-handlers';
import mongoose from 'mongoose';
import { logger, LOG_LEVELS } from '../../winston';

export const MongoConenct = function (callback) {
     console.log('creating mongo db connection');
     mongoose.connect(`${process.env.MONGO_URL}`, {
          connectTimeoutMS: 30000,
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
          console.log('=======================================');
          console.log('mongo connections error, Error: ', err);
          throw new DatabaseConnectionError();
     });
     db.on('disconnected', (thing) => {
          console.log('========================================');
          console.log('mongo connection disconnected, The thing: ', thing);
          // mongoose.connect(`${process.env.MONGO_URL}/study`, {
          //      connectTimeoutMS: 3000,
          //      keepAlive: true,
          // });
     });
     db.on('disconnecting', (thing) => {
          console.log('========================================');
          console.log('mongo connection disconnecting, The thing: ', thing);
     });
     db.on('close', (thing) => {
          console.log('========================================');
          console.log('mongo connection disconnecting, The thing: ', thing);
     });
};
