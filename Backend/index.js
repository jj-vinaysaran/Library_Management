const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Saran@533',
  database: 'Lib_db'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Get all books
app.get('/books', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const query = `SELECT * FROM books LIMIT ${limit} OFFSET ${offset}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching books: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Filter books based on criteria
app.get('/books/filter', (req, res) => {
  const { title, author, subject, publish_date } = req.query;
  let conditions = [];
  if (title) conditions.push(`title LIKE '%${title}%'`);
  if (author) conditions.push(`author LIKE '%${author}%'`);
  if (subject) conditions.push(`subject LIKE '%${subject}%'`);
  if (publish_date) conditions.push(`publish_date = '${publish_date}'`);

  let query = 'SELECT * FROM books';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error filtering books: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Create a new book
app.post('/books', (req, res) => {
  const { title, author, subject, publish_date } = req.body;
  const query = `INSERT INTO books (title, author, subject, publish_date) VALUES (?, ?, ?, ?)`;
  connection.query(query, [title, author, subject, publish_date], (err, result) => {
    if (err) {
      console.error('Error creating book: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(201).json({ message: 'Book created successfully', id: result.insertId });
  });
});

// Update an existing book
app.put('/books/:id', (req, res) => {
  const { title, author, subject, publish_date } = req.body;
  const { id } = req.params;
  const query = `UPDATE books SET title=?, author=?, subject=?, publish_date=? WHERE id=?`;
  connection.query(query, [title, author, subject, publish_date, id], (err, result) => {
    if (err) {
      console.error('Error updating book: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Book updated successfully' });
  });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM books WHERE id=?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting book: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// Get all books
app.get('/books/all', (req, res) => {
    const query = `SELECT * FROM books`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching all books: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
