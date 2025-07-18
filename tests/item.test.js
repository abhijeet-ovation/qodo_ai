const request = require('supertest');
const app = require('../src/app');

describe('Item API', () => {
  it('creates, retrieves, updates and deletes an item', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item', description: 'desc' });
    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.id;

    // Retrieve list
    const listRes = await request(app).get('/api/items');
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);

    // Retrieve single
    const singleRes = await request(app).get(`/api/items/${id}`);
    expect(singleRes.statusCode).toBe(200);
    expect(singleRes.body.name).toBe('Test Item');

    // Update
    const updateRes = await request(app)
      .put(`/api/items/${id}`)
      .send({ name: 'Updated Item' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.name).toBe('Updated Item');

    // Delete
    const deleteRes = await request(app).delete(`/api/items/${id}`);
    expect(deleteRes.statusCode).toBe(200);

    // Verify deletion
    const notFound = await request(app).get(`/api/items/${id}`);
    expect(notFound.statusCode).toBe(404);
  });
}); 