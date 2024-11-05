// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  describe('GET all Fragments route', () => {
    test('unauthenticated requests are denied', () =>
      request(app).get('/v1/fragments').expect(401));

    test('incorrect credentials are denied', () =>
      request(app)
        .get('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('authenticated users get a empty fragments array', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments[0].length).toBe(0);
    });

    test('authenticated users get a fragments array after POST', async () => {
      const data = 'test data';
      await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
      expect(res.body.fragments[0].length).toBe(1);
    });
  });

  describe('GET Fragments by Id route', () => {
    test('unauthenticated requests are denied', () =>
      request(app).get('/v1/fragments/123').expect(401));

    test('incorrect credentials are denied', () =>
      request(app)
        .get('/v1/fragments/123')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('authenticated users get a fragment data by id', async () => {
      const data = 'test data';
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(200);
      expect(res.get('Content-Type')).toBe('text/plain');
      expect(parseInt(res.get('Content-Length'))).toBe(Buffer.byteLength(data));
      expect(res.text).toBe(data);
    });

    test('authenticated users does not have any fragments', async () => {
      const res = await request(app)
        .get(`/v1/fragments/111111`)
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });
  });
});
