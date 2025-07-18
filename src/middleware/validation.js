const Joi = require('joi');

// Validation schemas
const itemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters'
  }),
  category: Joi.string().max(50).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional()
});

const searchSchema = Joi.object({
  query: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Search query cannot be empty',
    'string.min': 'Search query must be at least 1 character long',
    'string.max': 'Search query cannot exceed 100 characters',
    'any.required': 'Search query is required'
  }),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

const insightsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid item ID format',
    'any.required': 'Item ID is required'
  })
});

// Validation middleware
function validateItem(req, res, next) {
  const { error, value } = itemSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
}

function validateSearch(req, res, next) {
  const { error, value } = searchSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Search validation failed',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedSearch = value;
  next();
}

function validateItemId(req, res, next) {
  const { error } = Joi.string().uuid().validate(req.params.id);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid item ID format',
      details: 'Item ID must be a valid UUID'
    });
  }
  
  next();
}

function validateInsightsRequest(req, res, next) {
  const { error } = insightsSchema.validate(req.params);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid insights request',
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
}

module.exports = {
  validateItem,
  validateSearch,
  validateItemId,
  validateInsightsRequest,
  itemSchema,
  searchSchema
}; 