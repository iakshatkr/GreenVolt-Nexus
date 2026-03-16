import morgan from 'morgan';

export const loggerMiddleware = morgan(':method :url :status :response-time ms');

