const request = require('supertest');
const app = require('../src/app');

// This test was generated to improve coverage of edge cases

describe('Item API – edge and error cases', () => {
  it('responds with 400 Bad Request when name is missing on create', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ description: 'missing name field' });
    expect(res.statusCode).toBe(400);
    // API returns error structure: { success:false, error:"Validation failed", details:["Name is required"] }
    expect(res.body).toMatchObject({ success: false, error: 'Validation failed' });
    expect(res.body.details).toContain('Name is required');
  });

  const { v4: uuidv4 } = require('uuid');
  const bogusId = uuidv4();

  it('responds with 404 Not Found when retrieving a non-existent item', async () => {
    const res = await request(app).get(`/api/items/${bogusId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not (found|exist)/i);
  });

  it('responds with 404 Not Found when updating a non-existent item', async () => {
    const res = await request(app)
      .put(`/api/items/${bogusId}`)
      .send({ name: 'Should Fail' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not (found|exist)/i);
  });

  it('responds with 404 Not Found when deleting a non-existent item', async () => {
    const res = await request(app).delete(`/api/items/${bogusId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not (found|exist)/i);
  });
}); 