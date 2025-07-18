const { v4: uuidv4 } = require('uuid');

let items = [];

function getAll() {
  return items;
}

function getById(id) {
  return items.find((i) => i.id === id);
}

function create({ name, description }) {
  const newItem = {
    id: uuidv4(),
    name,
    description: description || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.push(newItem);
  return newItem;
}

function update(id, { name, description }) {
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return null;
  const existing = items[itemIndex];
  const updated = {
    ...existing,
    name: name !== undefined ? name : existing.name,
    description: description !== undefined ? description : existing.description,
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

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
}; 