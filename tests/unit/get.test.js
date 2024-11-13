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


  describe('GET Fragments info by Id route', () => {

    test('The route returns the metedata of the fragment', async () => {
      const data = 'Test data'
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}/info`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(200);
      expect(res.body.fragment).toEqual(result.body.fragments)
    });

  });

  describe('Conversion with .ext', () => {

    test('text/plain to .txt', async () => {
      const data = 'test data';
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      expect(result.statusCode).toBe(201);
      expect(result.body.status).toBe('ok');

      const res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.txt`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(200);
      expect(res.get('Content-Type')).toContain('text/plain');
      expect(res.text).toBe(data);
    });

    test('text/markdown to .md, .html and .txt', async () => {
      const mdToHtml = require('markdown-it')();
      const data = '# Test data'
      const htmldata = mdToHtml.render(data.toString())
      const textdata = htmldata.replace(/<[^>]*>/g, '');
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);

      const md_res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.md`)
        .auth('user1@email.com', 'password1');

      expect(md_res.statusCode).toBe(200);
      expect(md_res.get('Content-Type')).toContain('text/markdown');
      expect(md_res.text).toBe(data);

      const html_res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(html_res.statusCode).toBe(200);
      expect(html_res.get('Content-Type')).toContain('text/html');
      expect(html_res.text).toBe(htmldata);

      const txt_res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.txt`)
        .auth('user1@email.com', 'password1');

      expect(txt_res.statusCode).toBe(200);
      expect(txt_res.get('Content-Type')).toContain('text/plain');
      expect(txt_res.text).toBe(textdata);
    });

    test('text/html to .html and .txt', async () => {
      const data = '<p>Fahim</p>'
      const textdata = data.replace(/<[^>]*>/g, '');
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(data);

      const html_res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(html_res.statusCode).toBe(200);
      expect(html_res.get('Content-Type')).toContain('text/html');
      expect(html_res.text).toBe(data);

      const txt_res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.txt`)
        .auth('user1@email.com', 'password1');

      expect(txt_res.statusCode).toBe(200);
      expect(txt_res.get('Content-Type')).toContain('text/plain');
      expect(txt_res.text).toBe(textdata);
    });















    test('Unsupported Conversion fragment data', async () => {
      const data = '# Test data'
      const result = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(data);

      const res = await request(app)
        .get(`/v1/fragments/${result.body.fragments.id}.json`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(415);
    });

  });
});
