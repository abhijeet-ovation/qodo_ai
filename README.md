# Qodo AI API

A powerful AI-powered item management API built with Node.js and Express, featuring intelligent insights, smart search, sentiment analysis, and automated test generation.

## Features

🤖 **AI-Powered Features:**
- **Intelligent Insights**: Generate AI-powered insights for items including category suggestions, tags, and improvement recommendations
- **Smart Search**: Semantic search with AI understanding of queries
- **Sentiment Analysis**: Analyze the tone and sentiment of item descriptions
- **Automated Test Generation**: Generate comprehensive test cases for API endpoints
- **Item Recommendations**: Get AI-generated recommendations based on existing items

🔧 **Core Features:**
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for items
- **Advanced Search**: Search by query, category, or tags
- **Validation**: Comprehensive input validation with detailed error messages
- **Statistics**: Get insights about your data including categories, tags, and AI usage
- **Security**: Helmet.js security headers and CORS protection
- **Error Handling**: Graceful error handling with fallback mechanisms

## Quick Start

### Prerequisites

- Node.js ≥ 18
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qodo_ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env and add your OpenAI API key
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Basic CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get item by ID |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

### Search & Filtering

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items/search?query=term` | Search items by query |
| GET | `/api/items/category/:category` | Get items by category |
| GET | `/api/items/tag/:tag` | Get items by tag |
| GET | `/api/items/stats` | Get API statistics |

### AI-Powered Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items/:id/insights` | Generate AI insights for item |
| GET | `/api/items/:id/sentiment` | Analyze item sentiment |
| GET | `/api/items/:id/test-cases` | Generate test cases for item |
| GET | `/api/items/search/ai?query=term` | Smart search with AI |
| GET | `/api/items/recommendations` | Get AI recommendations |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API information |

## Request/Response Examples

### Create an Item

```bash
POST /api/items
Content-Type: application/json

{
  "name": "JavaScript Programming Book",
  "description": "Comprehensive guide to JavaScript programming",
  "category": "Books",
  "tags": ["programming", "javascript", "learning"]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "JavaScript Programming Book",
    "description": "Comprehensive guide to JavaScript programming",
    "category": "Books",
    "tags": ["programming", "javascript", "learning"],
    "aiInsights": null,
    "sentiment": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Item created successfully"
}
```

### Generate AI Insights

```bash
GET /api/items/123e4567-e89b-12d3-a456-426614174000/insights
```

Response:
```json
{
  "success": true,
  "data": {
    "item": { /* updated item with insights */ },
    "insights": {
      "category": "Educational",
      "tags": ["programming", "javascript", "education", "books"],
      "insights": "This is a comprehensive educational resource for JavaScript programming",
      "suggestions": [
        "Consider adding difficulty level",
        "Include practical examples",
        "Add prerequisites information"
      ]
    }
  },
  "message": "AI insights generated successfully"
}
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite includes:
- ✅ Basic CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ AI service functionality (mocked)
- ✅ Search and filtering
- ✅ API endpoints
- ✅ Response format validation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` |

## Project Structure

```
src/
├── controllers/
│   └── itemController.js    # Request handlers
├── middleware/
│   └── validation.js        # Input validation
├── models/
│   └── itemModel.js         # Data layer
├── routes/
│   └── items.js             # Route definitions
├── services/
│   └── aiService.js         # AI functionality
├── app.js                   # Express app setup
└── index.js                 # Server entry point

tests/
├── item.test.js             # API integration tests
└── aiService.test.js        # AI service unit tests
```

## AI Features Deep Dive

### Intelligent Insights
The AI analyzes item content and provides:
- **Category Suggestions**: Automatically categorize items
- **Tag Recommendations**: Suggest relevant tags
- **Business Insights**: Provide contextual analysis
- **Improvement Suggestions**: Recommendations for enhancement

### Smart Search
Uses AI to understand search intent:
- Semantic understanding of queries
- Context-aware matching
- Fallback to traditional search if AI fails

### Sentiment Analysis
Analyzes item descriptions for:
- **Sentiment**: Positive, negative, or neutral
- **Confidence**: How certain the AI is about the analysis
- **Tone**: Professional, casual, technical, etc.
- **Suggestions**: How to improve the content

### Test Generation
Automatically generates comprehensive test cases:
- Valid and invalid scenarios
- Edge cases
- API endpoint coverage
- Error handling tests

## Error Handling

The API provides comprehensive error handling:
- **Validation Errors**: Detailed field-level validation messages
- **Not Found Errors**: Clear messages for missing resources
- **AI Service Errors**: Graceful fallbacks when AI services are unavailable
- **Global Error Handler**: Consistent error response format

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Built-in protection against abuse
- **Error Sanitization**: No sensitive information in error responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Note**: This API requires an OpenAI API key to function. The AI features will gracefully fall back to basic functionality if the API key is not provided or if the AI service is unavailable.
