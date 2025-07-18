const { v4: uuidv4 } = require('uuid');

let items = [];

function getAll() {
  return items;
}

function getById(id) {
  return items.find((i) => i.id === id);
}

function create({ name, description, category, tags }) {
  const newItem = {
    id: uuidv4(),
    name,
    description: description || '',
    category: category || 'General',
    tags: tags || [],
    aiInsights: null,
    sentiment: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.push(newItem);
  return newItem;
}

function update(id, { name, description, category, tags, aiInsights, sentiment }) {
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return null;
  
  const existing = items[itemIndex];
  const updated = {
    ...existing,
    name: name !== undefined ? name : existing.name,
    description: description !== undefined ? description : existing.description,
    category: category !== undefined ? category : existing.category,
    tags: tags !== undefined ? tags : existing.tags,
    aiInsights: aiInsights !== undefined ? aiInsights : existing.aiInsights,
    sentiment: sentiment !== undefined ? sentiment : existing.sentiment,
    updatedAt: new Date(),
  };
  items[itemIndex] = updated;
  return updated;
}

function remove(id) {
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return null;
  const [removed] = items.splice(itemIndex, 1);
  return removed;
}

function search(query) {
  const queryLower = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(queryLower) ||
    item.description.toLowerCase().includes(queryLower) ||
    item.category.toLowerCase().includes(queryLower) ||
    item.tags.some(tag => tag.toLowerCase().includes(queryLower))
  );
}

function getByCategory(category) {
  return items.filter(item => item.category === category);
}

function getByTag(tag) {
  return items.filter(item => item.tags.includes(tag));
}

function getItemsWithInsights() {
  return items.filter(item => item.aiInsights !== null);
}

function updateAIInsights(id, insights) {
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return null;
  
  items[itemIndex].aiInsights = insights;
  items[itemIndex].updatedAt = new Date();
  return items[itemIndex];
}

function updateSentiment(id, sentiment) {
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return null;
  
  items[itemIndex].sentiment = sentiment;
  items[itemIndex].updatedAt = new Date();
  return items[itemIndex];
}

function getStats() {
  const total = items.length;
  const withInsights = items.filter(item => item.aiInsights !== null).length;
  const categories = [...new Set(items.map(item => item.category))];
  const allTags = items.flatMap(item => item.tags);
  const uniqueTags = [...new Set(allTags)];
  
  return {
    total,
    withInsights,
    categories: categories.length,
    uniqueTags: uniqueTags.length,
    averageTagsPerItem: total > 0 ? (allTags.length / total).toFixed(2) : 0
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  getByCategory,
  getByTag,
  getItemsWithInsights,
  updateAIInsights,
  updateSentiment,
  getStats
}; 