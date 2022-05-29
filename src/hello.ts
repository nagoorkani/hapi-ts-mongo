import { Request } from '@hapi/hapi';
import Joi from 'joi';

export const HelloRoutes = [
  {
    method: 'GET',
    path: '/hello',
    options: {
      tags: ['api'],
      handler: () => {
        return 'Hello! Welcome';
      },
    },
  },
  {
    method: 'GET',
    path: '/hello/{name}',
    options: {
      handler: (request: Request) => {
        return `Hello! Welcome ${request.params.name}`;
      },
      description: 'Get todo',
      notes: 'Returns a greetings with {name} param passed.',
      tags: ['api'],
      validate: {
        params: Joi.object({
          name: Joi.string()
            .required()
            .description('the {name} for the greetings.'),
        }),
      },
    },
  },
];
