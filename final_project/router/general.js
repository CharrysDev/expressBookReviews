const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});


public_users.get('/', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/booksdb');
      res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books list:", error.message);
      res.status(500).json({ message: "Error fetching books list" });
  }
});


public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
      const response = await axios.get(`http://localhost:5000/booksdb/isbn/${isbn}`);
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
      const response = await axios.get(`http://localhost:5000/booksdb/author/${author}`);
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details by author" });
  }
});


// Task 4: Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/booksdb/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details by title" });
    }
});


// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
      res.status(200).json(book.reviews);
  } else {
      res.status(404).json({ message: "Reviews not found for the given ISBN" });
  }
});


module.exports.general = public_users;
