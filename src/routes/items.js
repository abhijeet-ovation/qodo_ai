const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { 
  validateItem, 
  validateSearch, 
  validateItemId, 
  validateInsightsRequest 
} = require('../middleware/validation');

// Basic CRUD routes
router.get('/', itemController.getAllItems);
router.get('/stats', itemController.getStats);
router.get('/search', validateSearch, itemController.searchItems);
router.get('/search/ai', validateSearch, itemController.smartSearch);
router.get('/recommendations', itemController.getRecommendations);
router.get('/category/:category', itemController.getItemsByCategory);
router.get('/tag/:tag', itemController.getItemsByTag);
router.get('/:id', validateItemId, itemController.getItemById);
router.post('/', validateItem, itemController.createItem);
router.put('/:id', validateItemId, validateItem, itemController.updateItem);
router.delete('/:id', validateItemId, itemController.deleteItem);

// AI-powered routes
router.get('/:id/insights', validateInsightsRequest, itemController.generateInsights);
router.get('/:id/sentiment', validateInsightsRequest, itemController.analyzeSentiment);
router.get('/:id/test-cases', validateInsightsRequest, itemController.generateTestCases);

module.exports = router; 