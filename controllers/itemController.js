const Item = require("../models/Item");

// @desc    get all items
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// @desc    get item by ID
// @route   GET /api/items/:id
// @access  Public

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error(`Error getting item ${req.params.id}:`, error);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid item ID format" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    create new item
// @route   POST /api/items
// @access  Public

exports.createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required" });
    }
    const newItem = Item.create({ title, description });
    res.status(201).json({ success: true, data: newItem });

    // Broadcast change via websocket
    if (global.broadcast) {
      global.broadcast({ type: "ITEM_CREATED", data: newItem });
      global.broadcastActiveUsersCount();
    }
  } catch (error) {
    console.error("Error creating item:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc update an item
// @route PUT /api/items/:id
// @access Public

exports.updateItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && description === undefined) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide title or description" });
    }
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    const updatedItem = await item.save();
    res.status(200).json({ success: true, data: updatedItem });
    // Broadcast change via websocket
    if (global.broadcast) {
      global.broadcast({ type: "ITEM_UPDATED", data: updatedItem });
      global.broadcastActiveUsersCount();
    }
  } catch (error) {
    console.error(`Error updating item ${req.params.id}:`, error);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid item ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Public
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, data: { id: req.params.id } });

    // Broadcast change via WebSocket
    if (global.broadcast) {
      global.broadcast({ type: "ITEM_DELETED", id: req.params.id });
      global.broadcastActiveUsersCount();
    }
  } catch (error) {
    console.error(`Error deleting item ${req.params.id}:`, error);
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid item ID format" });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
