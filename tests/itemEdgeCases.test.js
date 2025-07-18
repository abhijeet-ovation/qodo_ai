const request = require('supertest');
const app = require('../src/app');

// Using a static UUID-like string to ensure the ID does not exist
const NON_EXISTENT_ID = '123e4567-e89b-12d3-a456-426614174000';

describe('Item API Edge Cases', () => {
  it('returns 400 when creating an item without a name', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ description: 'Missing name field' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 404 when retrieving a non-existent item', async () => {
    const res = await request(app).get(`/api/items/${NON_EXISTENT_ID}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 404 when updating a non-existent item', async () => {
    const res = await request(app)
      .put(`/api/items/${NON_EXISTENT_ID}`)
      .send({ name: 'Will Not Update' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 404 when deleting a non-existent item', async () => {
    const res = await request(app).delete(`/api/items/${NON_EXISTENT_ID}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});


describe('Health Check Endpoint', () => {
  it('responds with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
}); 