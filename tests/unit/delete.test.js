const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can delete a fragment', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const id = res.body.fragments.id;
    const del_res = await request(app)
    .delete(`/v1/fragments/${id}`)
    .auth('user1@email.com', 'password1')

    expect(del_res.statusCode).toBe(200);
    expect(del_res.body.status).toBe('ok');
  });

  test('authenticated users cannot delete a fragment that does not exist', async () => {
    const del_res = await request(app)
    .delete(`/v1/fragments/1234`)
    .auth('user1@email.com', 'password1')

    expect(del_res.statusCode).toBe(404);
  });

});
