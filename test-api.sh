#!/bin/bash

echo "🚀 Testing Qodo AI API Functionality"
echo "====================================="

# Wait for server to start
sleep 3

# Test 1: Health Check
echo -e "\n1️⃣ Testing Health Check..."
curl -s http://localhost:3000/health | jq '.'

# Test 2: API Info
echo -e "\n2️⃣ Testing API Info..."
curl -s http://localhost:3000/api | jq '.'

# Test 3: Create Items
echo -e "\n3️⃣ Creating Test Items..."

# Create first item
ITEM1=$(curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Programming Book",
    "description": "Comprehensive guide to JavaScript programming with modern ES6+ features",
    "category": "Books",
    "tags": ["programming", "javascript", "learning"]
  }')

echo "Created Item 1:"
echo $ITEM1 | jq '.'

# Extract ID for first item
ITEM1_ID=$(echo $ITEM1 | jq -r '.data.id')

# Create second item
ITEM2=$(curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Data Science Course",
    "description": "Learn Python for data science and machine learning",
    "category": "Courses",
    "tags": ["programming", "python", "data-science", "machine-learning"]
  }')

echo -e "\nCreated Item 2:"
echo $ITEM2 | jq '.'

# Extract ID for second item
ITEM2_ID=$(echo $ITEM2 | jq -r '.data.id')

# Test 4: Get All Items
echo -e "\n4️⃣ Getting All Items..."
curl -s http://localhost:3000/api/items | jq '.'

# Test 5: Get Item by ID
echo -e "\n5️⃣ Getting Item by ID..."
curl -s http://localhost:3000/api/items/$ITEM1_ID | jq '.'

# Test 6: Search Items
echo -e "\n6️⃣ Testing Search..."
curl -s "http://localhost:3000/api/items/search?query=programming" | jq '.'

# Test 7: Get Items by Category
echo -e "\n7️⃣ Testing Category Filter..."
curl -s http://localhost:3000/api/items/category/Books | jq '.'

# Test 8: Get Items by Tag
echo -e "\n8️⃣ Testing Tag Filter..."
curl -s http://localhost:3000/api/items/tag/programming | jq '.'

# Test 9: Get Statistics
echo -e "\n9️⃣ Testing Statistics..."
curl -s http://localhost:3000/api/items/stats | jq '.'

# Test 10: AI Insights
echo -e "\n🔮 Testing AI Insights..."
curl -s http://localhost:3000/api/items/$ITEM1_ID/insights | jq '.'

# Test 11: Sentiment Analysis
echo -e "\n😊 Testing Sentiment Analysis..."
curl -s http://localhost:3000/api/items/$ITEM1_ID/sentiment | jq '.'

# Test 12: Test Case Generation
echo -e "\n🧪 Testing Test Case Generation..."
curl -s http://localhost:3000/api/items/$ITEM1_ID/test-cases | jq '.'

# Test 13: Smart Search
echo -e "\n🔍 Testing Smart Search..."
curl -s "http://localhost:3000/api/items/search/ai?query=programming&limit=5" | jq '.'

# Test 14: Recommendations
echo -e "\n💡 Testing AI Recommendations..."
curl -s "http://localhost:3000/api/items/recommendations?limit=3" | jq '.'

# Test 15: Update Item
echo -e "\n✏️ Testing Item Update..."
curl -s -X PUT http://localhost:3000/api/items/$ITEM1_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated JavaScript Book",
    "description": "Updated description with new content",
    "category": "Updated Category"
  }' | jq '.'

# Test 16: Validation Error
echo -e "\n❌ Testing Validation Error..."
curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing name field"}' | jq '.'

# Test 17: Invalid ID Error
echo -e "\n❌ Testing Invalid ID Error..."
curl -s http://localhost:3000/api/items/invalid-id | jq '.'

# Test 18: Delete Item
echo -e "\n🗑️ Testing Item Deletion..."
curl -s -X DELETE http://localhost:3000/api/items/$ITEM2_ID | jq '.'

# Test 19: Verify Deletion
echo -e "\n✅ Verifying Deletion..."
curl -s http://localhost:3000/api/items/$ITEM2_ID | jq '.'

echo -e "\n🎉 API Testing Complete!"
echo "=====================================" 