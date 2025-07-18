#!/bin/bash

echo "🚀 Testing Qodo AI API Functionality"
echo "====================================="

# Wait for server to start
sleep 2

# Test 1: Health Check
echo -e "\n1️⃣ Testing Health Check..."
curl -s http://localhost:3000/health

# Test 2: API Info
echo -e "\n\n2️⃣ Testing API Info..."
curl -s http://localhost:3000/api

# Test 3: Create Items
echo -e "\n\n3️⃣ Creating Test Items..."

# Create first item
echo "Creating Item 1..."
ITEM1_RESPONSE=$(curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Programming Book",
    "description": "Comprehensive guide to JavaScript programming with modern ES6+ features",
    "category": "Books",
    "tags": ["programming", "javascript", "learning"]
  }')

echo "Response: $ITEM1_RESPONSE"

# Create second item
echo -e "\nCreating Item 2..."
ITEM2_RESPONSE=$(curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Data Science Course",
    "description": "Learn Python for data science and machine learning",
    "category": "Courses",
    "tags": ["programming", "python", "data-science", "machine-learning"]
  }')

echo "Response: $ITEM2_RESPONSE"

# Test 4: Get All Items
echo -e "\n\n4️⃣ Getting All Items..."
curl -s http://localhost:3000/api/items

# Test 5: Search Items
echo -e "\n\n5️⃣ Testing Search..."
curl -s "http://localhost:3000/api/items/search?query=programming"

# Test 6: Get Items by Category
echo -e "\n\n6️⃣ Testing Category Filter..."
curl -s http://localhost:3000/api/items/category/Books

# Test 7: Get Items by Tag
echo -e "\n\n7️⃣ Testing Tag Filter..."
curl -s http://localhost:3000/api/items/tag/programming

# Test 8: Get Statistics
echo -e "\n\n8️⃣ Testing Statistics..."
curl -s http://localhost:3000/api/items/stats

# Test 9: AI Insights (using the item we created earlier)
echo -e "\n\n🔮 Testing AI Insights..."
curl -s http://localhost:3000/api/items/a3e874a0-5155-4612-8c08-d3c96374aad8/insights

# Test 10: Sentiment Analysis
echo -e "\n\n😊 Testing Sentiment Analysis..."
curl -s http://localhost:3000/api/items/a3e874a0-5155-4612-8c08-d3c96374aad8/sentiment

# Test 11: Test Case Generation
echo -e "\n\n🧪 Testing Test Case Generation..."
curl -s http://localhost:3000/api/items/a3e874a0-5155-4612-8c08-d3c96374aad8/test-cases

# Test 12: Smart Search
echo -e "\n\n🔍 Testing Smart Search..."
curl -s "http://localhost:3000/api/items/search/ai?query=programming&limit=5"

# Test 13: Recommendations
echo -e "\n\n💡 Testing AI Recommendations..."
curl -s "http://localhost:3000/api/items/recommendations?limit=3"

# Test 14: Validation Error
echo -e "\n\n❌ Testing Validation Error..."
curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing name field"}'

# Test 15: Invalid ID Error
echo -e "\n\n❌ Testing Invalid ID Error..."
curl -s http://localhost:3000/api/items/invalid-id

echo -e "\n\n🎉 API Testing Complete!"
echo "=====================================" 