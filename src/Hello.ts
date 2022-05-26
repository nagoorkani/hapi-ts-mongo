import { Request } from '@hapi/hapi';

const index = () => {};

export const HelloRoutes = [
  {
    method: 'GET',
    path: '/hello',
    handler: () => {
      return 'Hello! Welcome';
    },
  },
  {
    method: 'GET',
    path: '/hello/{name}',
    handler: (request: Request) => {
      return `Hello! Welcome ${request.params.name}`;
    },
  },
];
