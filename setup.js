const Database = require('better-sqlite3');
const db = new Database('laundry.db');

// Part 1: Guided Build — Creating Your Database File
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    loadCount INTEGER NOT NULL,
    status TEXT NOT NULL,
    dropOffTime TEXT NOT NULL
  )
`);

console.log('Table created!');

// Part 2: Guided Build — Writing and Reading Real Rows
const insert = db.prepare(`
  INSERT INTO orders (customerName, loadCount, status, dropOffTime)
  VALUES (?, ?, ?, ?)
`);

insert.run('Maria Santos', 2, 'Pending', '8:00 AM');
insert.run('Pedro Reyes', 1, 'Washing', '9:15 AM');
insert.run('Ana Cruz', 3, 'Ready for Pickup', '7:30 AM');

console.log(db.prepare('SELECT * FROM orders').all());

// Part 3: Hands-On Practice 1 — Asking Real Questions with WHERE
const pending = db.prepare('SELECT * FROM orders WHERE status = ?').all('Pending');
console.log('Pending orders:', pending);

// Part 4: Hands-On Practice 2 — Counting and Sorting Your Data
console.log(
  db.prepare('SELECT status, COUNT(*) as total FROM orders GROUP BY status').all()
);

console.log(
  db.prepare('SELECT customerName, loadCount FROM orders ORDER BY loadCount DESC').all()
);
