import Hapi from '@hapi/hapi';
import { Server } from '@hapi/hapi';
import * as config from './config/dev.json';
import { HelloRoutes } from './hello';
import { productsRoutes } from './products';
import * as HapiSwagger from 'hapi-swagger';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import { version as APP_VERSION } from '../package.json';

export let server: Server;

export const init = async (): Promise<Server> => {
  server = Hapi.server({
    port: config.APP_PORT,
    host: config.APP_HOST,
  });

  // swagger
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Test API Documentation',
      version: APP_VERSION,
    },
  };

  const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ];

  await server.register(plugins);

  // adding routes - inline
  server.route({
    method: 'GET',
    path: '/',
    handler: () => 'Hello, Server is ready!',
  });

  // adding routes - imported from external module
  server.route(HelloRoutes);
  server.route(productsRoutes);

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
