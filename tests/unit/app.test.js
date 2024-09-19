// tests/unit/health.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');



describe('Error check', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/error');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
