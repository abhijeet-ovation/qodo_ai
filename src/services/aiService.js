const OpenAI = require('openai');
const natural = require('natural');

class AIService {
  constructor() {
    // Initialize OpenAI only if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      this.openai = null;
      console.warn('OpenAI API key not found. AI features will use fallback responses.');
    }
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Generate AI insights for an item
   */
  async generateInsights(item) {
    try {
      if (!this.openai) {
        return this.getFallbackInsights(item);
      }

      const prompt = `Analyze this item and provide intelligent insights:
        Name: ${item.name}
        Description: ${item.description || 'No description provided'}
        
        Please provide:
        1. Suggested category
        2. Relevant tags
        3. Business insights
        4. Improvement suggestions
        
        Format as JSON with keys: category, tags, insights, suggestions`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('AI insight generation failed:', error);
      return this.getFallbackInsights(item);
    }
  }

  /**
   * Smart search with semantic understanding
   */
  async smartSearch(items, query) {
    try {
      if (!this.openai) {
        return this.fallbackSearch(items, query);
      }

      const prompt = `Given these items and search query, return the most relevant items:
        
        Search Query: "${query}"
        
        Items:
        ${items.map(item => `- ${item.name}: ${item.description || 'No description'}`).join('\n')}
        
        Return only the item names that match the query, separated by commas.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      });

      const matchedNames = response.choices[0].message.content
        .split(',')
        .map(name => name.trim().replace(/^[-*]\s*/, ''));

      return items.filter(item => 
        matchedNames.some(name => 
          item.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Smart search failed:', error);
      return this.fallbackSearch(items, query);
    }
  }

  /**
   * Generate item recommendations based on existing items
   */
  async generateRecommendations(items, limit = 5) {
    try {
      if (!this.openai) {
        return this.getFallbackRecommendations(items, limit);
      }

      const prompt = `Based on these existing items, suggest ${limit} new related items:
        
        Existing Items:
        ${items.map(item => `- ${item.name}: ${item.description || 'No description'}`).join('\n')}
        
        Return suggestions as JSON array with objects containing: name, description, category`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      return this.parseRecommendations(content);
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.getFallbackRecommendations(items, limit);
    }
  }

  /**
   * Analyze item sentiment and provide feedback
   */
  async analyzeSentiment(item) {
    try {
      if (!this.openai) {
        return this.getFallbackSentiment();
      }

      const prompt = `Analyze the sentiment and tone of this item:
        Name: ${item.name}
        Description: ${item.description || 'No description'}
        
        Provide analysis as JSON with: sentiment (positive/negative/neutral), confidence (0-1), tone, suggestions`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.5,
      });

      const content = response.choices[0].message.content;
      return this.parseSentimentAnalysis(content);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return this.getFallbackSentiment();
    }
  }

  /**
   * Generate test cases for an item
   */
  async generateTestCases(item) {
    try {
      if (!this.openai) {
        return this.getFallbackTestCases();
      }

      const prompt = `Generate comprehensive test cases for this item API endpoint:
        
        Item Structure:
        - id: string
        - name: string (required)
        - description: string (optional)
        - createdAt: date
        - updatedAt: date
        
        Generate test cases covering:
        1. Valid item creation
        2. Invalid item creation (missing name)
        3. Item retrieval
        4. Item update
        5. Item deletion
        6. Edge cases
        
        Return as JSON with test cases array.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      return this.parseTestCases(content);
    } catch (error) {
      console.error('Test case generation failed:', error);
      return this.getFallbackTestCases();
    }
  }

  // Helper methods
  parseAIResponse(content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackInsights();
    }
  }

  parseRecommendations(content) {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : this.getFallbackRecommendations([], 5);
    } catch (error) {
      console.error('Failed to parse recommendations:', error);
      return this.getFallbackRecommendations([], 5);
    }
  }

  parseSentimentAnalysis(content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse sentiment analysis:', error);
      return this.getFallbackSentiment();
    }
  }

  parseTestCases(content) {
    try {
      const parsed = JSON.parse(content);
      return parsed && parsed.testCases ? parsed : this.getFallbackTestCases();
    } catch (error) {
      console.error('Failed to parse test cases:', error);
      return this.getFallbackTestCases();
    }
  }

  getFallbackInsights(item) {
    return {
      category: 'General',
      tags: ['item', 'general'],
      insights: 'Standard item with basic information',
      suggestions: ['Add more detailed description', 'Consider adding tags']
    };
  }

  getFallbackSentiment() {
    return { 
      sentiment: 'neutral', 
      confidence: 0.5, 
      tone: 'neutral', 
      suggestions: [] 
    };
  }

  fallbackSearch(items, query) {
    const queryLower = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(queryLower) ||
      (item.description && item.description.toLowerCase().includes(queryLower))
    );
  }

  getFallbackRecommendations(items, limit) {
    const categories = ['Technology', 'Books', 'Electronics', 'Clothing', 'Food'];
    const recommendations = [];
    
    for (let i = 0; i < limit; i++) {
      recommendations.push({
        name: `Recommended Item ${i + 1}`,
        description: `AI-generated recommendation based on your items`,
        category: categories[i % categories.length]
      });
    }
    
    return recommendations;
  }

  getFallbackTestCases() {
    return {
      testCases: [
        {
          name: 'Create valid item',
          method: 'POST',
          path: '/api/items',
          body: { name: 'Test Item', description: 'Test Description' },
          expectedStatus: 201
        },
        {
          name: 'Create item without name',
          method: 'POST',
          path: '/api/items',
          body: { description: 'Test Description' },
          expectedStatus: 400
        }
      ]
    };
  }
}

module.exports = new AIService(); 