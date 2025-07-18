const request = require('supertest');
const app = require('../src/app');

describe('Qodo AI API - Item Management', () => {
  let testItemId;

  describe('Basic CRUD Operations', () => {
    it('should create, retrieve, update and delete an item', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/items')
        .send({ 
          name: 'Test Item', 
          description: 'A test item for testing',
          category: 'Testing',
          tags: ['test', 'example']
        });
      
      expect(createRes.statusCode).toBe(201);
      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data.name).toBe('Test Item');
      expect(createRes.body.data.category).toBe('Testing');
      expect(createRes.body.data.tags).toEqual(['test', 'example']);
      
      testItemId = createRes.body.data.id;

      // Retrieve list
      const listRes = await request(app).get('/api/items');
      expect(listRes.statusCode).toBe(200);
      expect(listRes.body.success).toBe(true);
      expect(listRes.body.count).toBeGreaterThanOrEqual(1);

      // Retrieve single
      const singleRes = await request(app).get(`/api/items/${testItemId}`);
      expect(singleRes.statusCode).toBe(200);
      expect(singleRes.body.success).toBe(true);
      expect(singleRes.body.data.name).toBe('Test Item');

      // Update
      const updateRes = await request(app)
        .put(`/api/items/${testItemId}`)
        .send({ 
          name: 'Updated Test Item',
          description: 'Updated description',
          category: 'Updated Category'
        });
      
      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.name).toBe('Updated Test Item');
      expect(updateRes.body.data.category).toBe('Updated Category');

      // Delete
      const deleteRes = await request(app).delete(`/api/items/${testItemId}`);
      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      // Verify deletion
      const notFound = await request(app).get(`/api/items/${testItemId}`);
      expect(notFound.statusCode).toBe(404);
      expect(notFound.body.success).toBe(false);
    });

    it('should validate required fields when creating item', async () => {
      const res = await request(app)
        .post('/api/items')
        .send({ description: 'Missing name' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should validate item ID format', async () => {
      const res = await request(app).get('/api/items/invalid-id');
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid item ID format');
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(async () => {
      // Create test items
      await request(app).post('/api/items').send({
        name: 'JavaScript Book',
        description: 'Learn JavaScript programming',
        category: 'Books',
        tags: ['programming', 'javascript']
      });

      await request(app).post('/api/items').send({
        name: 'Python Course',
        description: 'Python programming course',
        category: 'Courses',
        tags: ['programming', 'python']
      });
    });

    it('should search items by query', async () => {
      const res = await request(app)
        .get('/api/items/search')
        .query({ query: 'programming' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(2);
    });

    it('should get items by category', async () => {
      const res = await request(app).get('/api/items/category/Books');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.category).toBe('Books');
    });

    it('should get items by tag', async () => {
      const res = await request(app).get('/api/items/tag/programming');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(2);
    });

    it('should validate search query', async () => {
      const res = await request(app)
        .get('/api/items/search')
        .query({ query: '' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Search validation failed');
    });
  });

  describe('Statistics', () => {
    it('should return API statistics', async () => {
      const res = await request(app).get('/api/items/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('withInsights');
      expect(res.body.data).toHaveProperty('categories');
      expect(res.body.data).toHaveProperty('uniqueTags');
    });
  });

  describe('AI Features', () => {
    let aiTestItemId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/items')
        .send({
          name: 'AI Test Item',
          description: 'An item for testing AI features',
          category: 'Technology',
          tags: ['ai', 'test']
        });
      
      aiTestItemId = createRes.body.data.id;
    });

    it('should generate AI insights for an item', async () => {
      const res = await request(app).get(`/api/items/${aiTestItemId}/insights`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('item');
      expect(res.body.data).toHaveProperty('insights');
      expect(res.body.data.insights).toHaveProperty('category');
      expect(res.body.data.insights).toHaveProperty('tags');
      expect(res.body.data.insights).toHaveProperty('insights');
      expect(res.body.data.insights).toHaveProperty('suggestions');
    });

    it('should analyze item sentiment', async () => {
      const res = await request(app).get(`/api/items/${aiTestItemId}/sentiment`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('item');
      expect(res.body.data).toHaveProperty('sentiment');
      expect(res.body.data.sentiment).toHaveProperty('sentiment');
      expect(res.body.data.sentiment).toHaveProperty('confidence');
      expect(res.body.data.sentiment).toHaveProperty('tone');
    });

    it('should generate test cases for an item', async () => {
      const res = await request(app).get(`/api/items/${aiTestItemId}/test-cases`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('testCases');
      expect(Array.isArray(res.body.data.testCases)).toBe(true);
    });

    it('should perform smart search with AI', async () => {
      const res = await request(app)
        .get('/api/items/search/ai')
        .query({ query: 'technology', limit: 5 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.query).toBe('technology');
    });

    it('should generate item recommendations', async () => {
      const res = await request(app)
        .get('/api/items/recommendations')
        .query({ limit: 3 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.count).toBeLessThanOrEqual(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent items', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      
      const res = await request(app).get(`/api/items/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Item not found');
    });

    it('should handle invalid routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });
  });

  describe('API Information', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
    });

    it('should return API information', async () => {
      const res = await request(app).get('/api');
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Qodo AI API');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body.features).toBeDefined();
      expect(Array.isArray(res.body.features)).toBe(true);
    });
  });
}); 