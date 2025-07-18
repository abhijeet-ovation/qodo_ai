const aiService = require('../src/services/aiService');

// Mock OpenAI to avoid actual API calls during testing
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                category: 'Technology',
                tags: ['ai', 'test'],
                insights: 'This is a test item for AI analysis',
                suggestions: ['Add more details', 'Consider categorization']
              })
            }
          }]
        })
      }
    }
  }));
});

describe('AI Service', () => {
  const mockItem = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test AI Item',
    description: 'A test item for AI analysis',
    category: 'Technology',
    tags: ['ai', 'test'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Reset environment variable for each test
    delete process.env.OPENAI_API_KEY;
  });

  describe('generateInsights', () => {
    it('should generate AI insights for an item', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      const insights = await aiService.generateInsights(mockItem);
      
      expect(insights).toBeDefined();
      expect(insights).toHaveProperty('category');
      expect(insights).toHaveProperty('tags');
      expect(insights).toHaveProperty('insights');
      expect(insights).toHaveProperty('suggestions');
      expect(Array.isArray(insights.tags)).toBe(true);
      expect(Array.isArray(insights.suggestions)).toBe(true);
    });

    it('should handle missing API key gracefully', async () => {
      const insights = await aiService.generateInsights(mockItem);
      
      expect(insights).toBeDefined();
      expect(insights.category).toBe('General');
      expect(insights.tags).toEqual(['item', 'general']);
    });

    it('should handle API errors gracefully', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const insights = await aiService.generateInsights(mockItem);
      
      expect(insights).toBeDefined();
      expect(insights.category).toBe('General');
      expect(insights.tags).toEqual(['item', 'general']);
    });
  });

  describe('smartSearch', () => {
    const mockItems = [
      { name: 'JavaScript Book', description: 'Learn JavaScript' },
      { name: 'Python Course', description: 'Python programming' },
      { name: 'Web Development', description: 'Full-stack development' }
    ];

    it('should perform smart search with AI', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      const results = await aiService.smartSearch(mockItems, 'programming');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should fallback to basic search when API key is missing', async () => {
      const results = await aiService.smartSearch(mockItems, 'JavaScript');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('JavaScript Book');
    });

    it('should fallback to basic search on API error', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const results = await aiService.smartSearch(mockItems, 'JavaScript');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('JavaScript Book');
    });
  });

  describe('generateRecommendations', () => {
    const mockItems = [
      { name: 'JavaScript Book', description: 'Learn JavaScript' },
      { name: 'Python Course', description: 'Python programming' }
    ];

    it('should generate recommendations based on existing items', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock specific response for recommendations
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify([
                    { name: 'React Course', description: 'Learn React', category: 'Technology' },
                    { name: 'Node.js Guide', description: 'Server-side JavaScript', category: 'Technology' }
                  ])
                }
              }]
            })
          }
        }
      }));

      const recommendations = await aiService.generateRecommendations(mockItems, 3);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });

    it('should handle missing API key gracefully', async () => {
      const recommendations = await aiService.generateRecommendations(mockItems, 5);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(5);
    });

    it('should handle API errors gracefully', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const recommendations = await aiService.generateRecommendations(mockItems, 5);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(5);
    });
  });

  describe('analyzeSentiment', () => {
    it('should analyze item sentiment', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock specific response for sentiment analysis
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify({
                    sentiment: 'positive',
                    confidence: 0.8,
                    tone: 'professional',
                    suggestions: ['Add more technical details']
                  })
                }
              }]
            })
          }
        }
      }));

      const sentiment = await aiService.analyzeSentiment(mockItem);
      
      expect(sentiment).toBeDefined();
      expect(sentiment).toHaveProperty('sentiment');
      expect(sentiment).toHaveProperty('confidence');
      expect(sentiment).toHaveProperty('tone');
      expect(sentiment).toHaveProperty('suggestions');
      expect(['positive', 'negative', 'neutral']).toContain(sentiment.sentiment);
      expect(sentiment.confidence).toBeGreaterThanOrEqual(0);
      expect(sentiment.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle missing API key gracefully', async () => {
      const sentiment = await aiService.analyzeSentiment(mockItem);
      
      expect(sentiment).toBeDefined();
      expect(sentiment.sentiment).toBe('neutral');
      expect(sentiment.confidence).toBe(0.5);
    });

    it('should handle API errors gracefully', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const sentiment = await aiService.analyzeSentiment(mockItem);
      
      expect(sentiment).toBeDefined();
      expect(sentiment.sentiment).toBe('neutral');
      expect(sentiment.confidence).toBe(0.5);
    });
  });

  describe('generateTestCases', () => {
    it('should generate test cases for an item', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock specific response for test cases
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: JSON.stringify({
                    testCases: [
                      {
                        name: 'Create valid item',
                        method: 'POST',
                        path: '/api/items',
                        body: { name: 'Test Item' },
                        expectedStatus: 201
                      }
                    ]
                  })
                }
              }]
            })
          }
        }
      }));

      const testCases = await aiService.generateTestCases(mockItem);
      
      expect(testCases).toBeDefined();
      expect(testCases).toHaveProperty('testCases');
      expect(Array.isArray(testCases.testCases)).toBe(true);
    });

    it('should handle missing API key gracefully', async () => {
      const testCases = await aiService.generateTestCases(mockItem);
      
      expect(testCases).toBeDefined();
      expect(testCases).toHaveProperty('testCases');
      expect(Array.isArray(testCases.testCases)).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      // Set API key to enable AI features
      process.env.OPENAI_API_KEY = 'test-key';
      
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.mockImplementationOnce(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));

      const testCases = await aiService.generateTestCases(mockItem);
      
      expect(testCases).toBeDefined();
      expect(testCases).toHaveProperty('testCases');
      expect(Array.isArray(testCases.testCases)).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    it('should parse AI responses correctly', () => {
      const validJson = '{"category": "Test", "tags": ["test"]}';
      const result = aiService.parseAIResponse(validJson);
      
      expect(result).toEqual({
        category: 'Test',
        tags: ['test']
      });
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = 'invalid json';
      const result = aiService.parseAIResponse(invalidJson);
      
      expect(result).toBeDefined();
      expect(result.category).toBe('General');
    });

    it('should provide fallback insights', () => {
      const fallback = aiService.getFallbackInsights(mockItem);
      
      expect(fallback).toBeDefined();
      expect(fallback.category).toBe('General');
      expect(Array.isArray(fallback.tags)).toBe(true);
      expect(Array.isArray(fallback.suggestions)).toBe(true);
    });

    it('should perform fallback search', () => {
      const items = [
        { name: 'JavaScript Book', description: 'Learn JavaScript' },
        { name: 'Python Course', description: 'Python programming' }
      ];
      
      const results = aiService.fallbackSearch(items, 'JavaScript');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('JavaScript Book');
    });
  });
}); 