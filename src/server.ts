import Hapi from '@hapi/hapi';
import { Request, Server } from '@hapi/hapi';
import * as config from './config/dev.json';

export let server: Server;

export const init = async (): Promise<Server> => {
  server = Hapi.server({
    port: config.APP_PORT,
    host: config.APP_HOST,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => 'Hello, Server is read!',
  });

  return server;
};

export const start = async (): Promise<void> => {
  console.log(
    `Starting server, listening on ${server.settings.host}:${server.settings.port}`
  );
  return server.start();
};

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection');
  console.error(err);
  process.exit(1);
});
