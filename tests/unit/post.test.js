const request = require('supertest');

const app = require('../../src/app');

const hash = require('../../src/hash');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can post a text/plain fragment', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users can post a text/markdown fragment', async () => {
    const data = '# Test data'
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users can post a text/html fragment', async () => {
    const data = '<p>Test data</p>'
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users can post a text/csv fragment', async () => {
    const data = 'field1,field2\nvalue1,value2'
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users can post a application/json fragment', async () => {
    const data = JSON.stringify({ field1: 'value1', field2: 'value2' })
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Invalid file type', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/plain')
      .send(data);

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('POST response includes a Location header', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.header).toHaveProperty('location');
    expect(res.header.location).toMatch(/^http/); // Optionally check if it starts with 'http'
  });

  test('POST response includes all necessary and expected properties', async () => {
    const data = 'test data';
    const size = Buffer.byteLength(data);
    const hashed_email = hash('user1@email.com');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toHaveProperty('id');
    expect(res.body.fragments).toHaveProperty('created');

    expect(res.body.fragments).toHaveProperty('type');
    expect(res.body.fragments.type).toBe('text/plain');

    expect(res.body.fragments).toHaveProperty('updated');

    expect(res.body.fragments).toHaveProperty('size');
    expect(res.body.fragments.size).toBe(size);

    expect(res.body.fragments).toHaveProperty('ownerId');
    expect(res.body.fragments.ownerId).toBe(hashed_email);
  });

  test('No data sent through the body', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
  });
});
