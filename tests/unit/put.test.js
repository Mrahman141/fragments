const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can update a fragment', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const id = res.body.fragments.id;
    const updated_data = "Updated data"
    const update_res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(updated_data);

    expect(update_res.statusCode).toBe(200);
    expect(update_res.body.status).toBe('ok');

    const get_res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(get_res.statusCode).toBe(200);
    expect(get_res.get('Content-Type')).toBe('text/plain');
    expect(parseInt(get_res.get('Content-Length'))).toBe(Buffer.byteLength(updated_data));
    expect(get_res.text).toBe(updated_data);
  });

  test('authenticated users tries to update the fragment along with type', async () => {
    const data = 'test data';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const id = res.body.fragments.id;
    const updated_data = "<p>update data</p>"
    const update_res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(updated_data);

    expect(update_res.statusCode).toBe(400);
  });

  test('authenticated users tries to update the fragment that does not exist', async () => {

    const updated_data = "update data"
    const update_res = await request(app)
      .put(`/v1/fragments/1234`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(updated_data);

    expect(update_res.statusCode).toBe(404);
  });

});
