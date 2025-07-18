const itemModel = require('../models/itemModel');

exports.getAllItems = (req, res) => {
  const items = itemModel.getAll();
  res.json(items);
};

exports.getItemById = (req, res) => {
  const id = req.params.id;
  const item = itemModel.getById(id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
};

exports.createItem = (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  const newItem = itemModel.create({ name, description });
  res.status(201).json(newItem);
};

exports.updateItem = (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const updated = itemModel.update(id, { name, description });
  if (!updated) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(updated);
};

exports.deleteItem = (req, res) => {
  const id = req.params.id;
  const deleted = itemModel.remove(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json({ message: 'Item deleted' });
}; 