const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'mysql', 
  user: 'root',
  password: 'P@ssw0rd!2024#',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

const promisePool = pool.promise();

app.get('/health', (req, res) => {
  res.send('API is running');
});

app.get('/items', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM items');
    res.send(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

app.post('/items', async (req, res) => {
  const item = req.body;
  try {
    const [result] = await promisePool.query('INSERT INTO items SET ?', [item]);
    res.status(201).send(`Item added with ID: ${result.insertId}`);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Error adding item');
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const item = req.body;
  try {
    await promisePool.query('UPDATE items SET ? WHERE id = ?', [item, id]);
    res.send(`Item modified with ID: ${id}`);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Error updating item');
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await promisePool.query('DELETE FROM items WHERE id = ?', [id]);
    res.send(`Item deleted with ID: ${id}`);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
