require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // lets client.html call this API when opened on its own (file:// or Live Server)
app.use(express.json());
app.use(express.static(__dirname)); // lets you use http://localhost:3000/client.html too

// Request logging middleware to easily trace requests in the server terminal
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Rate Limiting — Stopping Abuse (20 requests per minute)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

const db = new Database(path.join(__dirname, 'laundry.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    loadCount INTEGER NOT NULL,
    status TEXT NOT NULL,
    dropOffTime TEXT NOT NULL
  )
`);

// Authentication Middleware: require valid x-api-key header
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.API_KEY) {
    const error = new Error('Invalid or missing API key.');
    error.statusCode = 401;
    return next(error);
  }
  next();
}

// Input Validation: validates all fields at once
function validateOrder(data, isUpdate = false) {
  const errors = [];
  const allowedStatuses = ['Pending', 'Washing', 'Ready for Pickup', 'Claimed'];

  if (!isUpdate) {
    if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim() === '') {
      errors.push('customerName is required.');
    }
    if (typeof data.loadCount !== 'number' || data.loadCount <= 0) {
      errors.push('loadCount must be a positive number.');
    }
    // Default to 'Pending' if not provided
    const statusToCheck = data.status || 'Pending';
    if (!allowedStatuses.includes(statusToCheck)) {
      errors.push('status must be one of: ' + allowedStatuses.join(', '));
    }
    if (!data.dropOffTime || typeof data.dropOffTime !== 'string' || data.dropOffTime.trim() === '') {
      errors.push('dropOffTime is required.');
    }
  } else {
    // PUT only checks the fields being updated
    if (!data.status || !allowedStatuses.includes(data.status)) {
      errors.push('status must be one of: ' + allowedStatuses.join(', '));
    }
  }

  return errors;
}

// GET /orders — list every order (open access)
app.get('/orders', (req, res, next) => {
  try {
    const orders = db.prepare('SELECT * FROM orders').all();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /orders/:id — get a single order by ID (open access)
app.get('/orders/:id', (req, res, next) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /orders — create a new order (requires API key)
app.post('/orders', requireApiKey, (req, res, next) => {
  try {
    const errors = validateOrder(req.body, false);
    if (errors.length > 0) {
      const error = new Error(errors.join(' '));
      error.statusCode = 400;
      throw error;
    }

    const { customerName, loadCount, status, dropOffTime } = req.body;
    const stmt = db.prepare(`
      INSERT INTO orders (customerName, loadCount, status, dropOffTime)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(customerName.trim(), loadCount, status || 'Pending', dropOffTime.trim());

    const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newOrder);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

// PUT /orders/:id — update order status (requires API key)
app.put('/orders/:id', requireApiKey, (req, res, next) => {
  try {
    const errors = validateOrder(req.body, true);
    if (errors.length > 0) {
      const error = new Error(errors.join(' '));
      error.statusCode = 400;
      throw error;
    }

    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    const result = stmt.run(req.body.status.trim(), req.params.id);

    if (result.changes === 0) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
});

// DELETE /orders/:id — cancel an order (requires API key)
app.delete('/orders/:id', requireApiKey, (req, res, next) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
    res.json({ message: 'Order cancelled', cancelledOrder: order });
  } catch (err) {
    next(err);
  }
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Something went wrong on our end.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
