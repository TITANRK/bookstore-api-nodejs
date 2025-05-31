const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const DATA_FILE = './books.json';

// Function to read books data from JSON file
function readBooks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Function to write books data to JSON file
function writeBooks(books) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// GET /books - fetch all books
app.get('/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

// POST /books - add a new book
app.post('/books', (req, res) => {
  const books = readBooks();
  const { title, author, price, publishedDate } = req.body;

  if (!title || !author || !price || !publishedDate) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    price,
    publishedDate,
  };

  books.push(newBook);
  writeBooks(books);

  res.status(201).json(newBook);
});

// PUT /books/:id - update book details
app.put('/books/:id', (req, res) => {
  const books = readBooks();
  const bookId = parseInt(req.params.id);
  const { title, author, price, publishedDate } = req.body;

  const index = books.findIndex(book => book.id === bookId);
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (title) books[index].title = title;
  if (author) books[index].author = author;
  if (price) books[index].price = price;
  if (publishedDate) books[index].publishedDate = publishedDate;

  writeBooks(books);

  res.json(books[index]);
});

// DELETE /books/:id - remove a book
app.delete('/books/:id', (req, res) => {
  const books = readBooks();
  const bookId = parseInt(req.params.id);

  const filteredBooks = books.filter(book => book.id !== bookId);
  if (filteredBooks.length === books.length) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  writeBooks(filteredBooks);

  res.json({ message: 'Book deleted successfully.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
