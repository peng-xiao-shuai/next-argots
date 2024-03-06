import { appRouter } from './routers';
import { createCallerFactory } from './trpc';

const createCaller = createCallerFactory(appRouter);

export const serverClient = createCaller({});
