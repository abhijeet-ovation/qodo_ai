const itemModel = require('../models/itemModel');
const aiService = require('../services/aiService');

exports.getAllItems = (req, res) => {
  try {
    const items = itemModel.getAll();
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items',
      message: error.message
    });
  }
};

exports.getItemById = (req, res) => {
  try {
    const id = req.params.id;
    const item = itemModel.getById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The requested item does not exist'
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve item',
      message: error.message
    });
  }
};

exports.createItem = (req, res) => {
  try {
    const { name, description, category, tags } = req.validatedData;
    const newItem = itemModel.create({ name, description, category, tags });
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create item',
      message: error.message
    });
  }
};

exports.updateItem = (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, category, tags } = req.validatedData;
    const updated = itemModel.update(id, { name, description, category, tags });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The item you are trying to update does not exist'
      });
    }
    
    res.json({
      success: true,
      data: updated,
      message: 'Item updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update item',
      message: error.message
    });
  }
};

exports.deleteItem = (req, res) => {
  try {
    const id = req.params.id;
    const deleted = itemModel.remove(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The item you are trying to delete does not exist'
      });
    }
    
    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: { id: deleted.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete item',
      message: error.message
    });
  }
};

// AI-powered endpoints
exports.generateInsights = async (req, res) => {
  try {
    const id = req.params.id;
    const item = itemModel.getById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The requested item does not exist'
      });
    }

    const insights = await aiService.generateInsights(item);
    const updatedItem = itemModel.updateAIInsights(id, insights);
    
    res.json({
      success: true,
      data: {
        item: updatedItem,
        insights: insights
      },
      message: 'AI insights generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights',
      message: error.message
    });
  }
};

exports.smartSearch = async (req, res) => {
  try {
    const { query, limit } = req.validatedSearch;
    const allItems = itemModel.getAll();
    
    const results = await aiService.smartSearch(allItems, query);
    const limitedResults = results.slice(0, limit);
    
    res.json({
      success: true,
      data: limitedResults,
      count: limitedResults.length,
      query: query,
      message: `Found ${limitedResults.length} items matching "${query}"`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const allItems = itemModel.getAll();
    
    const recommendations = await aiService.generateRecommendations(allItems, limit);
    
    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      message: `Generated ${recommendations.length} recommendations`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
};

exports.analyzeSentiment = async (req, res) => {
  try {
    const id = req.params.id;
    const item = itemModel.getById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The requested item does not exist'
      });
    }

    const sentiment = await aiService.analyzeSentiment(item);
    const updatedItem = itemModel.updateSentiment(id, sentiment);
    
    res.json({
      success: true,
      data: {
        item: updatedItem,
        sentiment: sentiment
      },
      message: 'Sentiment analysis completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sentiment analysis failed',
      message: error.message
    });
  }
};

exports.generateTestCases = async (req, res) => {
  try {
    const id = req.params.id;
    const item = itemModel.getById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: 'The requested item does not exist'
      });
    }

    const testCases = await aiService.generateTestCases(item);
    
    res.json({
      success: true,
      data: testCases,
      message: 'Test cases generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate test cases',
      message: error.message
    });
  }
};

// Additional utility endpoints
exports.searchItems = (req, res) => {
  try {
    const { query } = req.validatedSearch;
    const results = itemModel.search(query);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      query: query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
};

exports.getItemsByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const items = itemModel.getByCategory(category);
    
    res.json({
      success: true,
      data: items,
      count: items.length,
      category: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items by category',
      message: error.message
    });
  }
};

exports.getItemsByTag = (req, res) => {
  try {
    const { tag } = req.params;
    const items = itemModel.getByTag(tag);
    
    res.json({
      success: true,
      data: items,
      count: items.length,
      tag: tag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items by tag',
      message: error.message
    });
  }
};

exports.getStats = (req, res) => {
  try {
    const stats = itemModel.getStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
      message: error.message
    });
  }
}; 