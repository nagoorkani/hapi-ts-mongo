import { Server } from '@hapi/hapi';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';

import { init } from '../server';

describe('/hello', () => {
  let server: Server;

  beforeEach((done) => {
    init().then((s) => {
      server = s;
      done();
    });
  });

  afterEach((done) => {
    server.stop().then(() => done());
  });

  it('say hello welcome', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/hello',
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal('Hello! Welcome');
  });

  it('say hello welcome with param', async () => {
    const name = 'Nagoor';
    const res = await server.inject({
      method: 'get',
      url: `/hello/${name}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal(`Hello! Welcome ${name}`);
  });
});
