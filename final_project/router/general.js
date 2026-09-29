const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ========================================
// REGISTER A NEW USER
// ========================================

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User registered successfully"
  });

});


// ========================================
// GET ALL BOOKS
// ========================================

public_users.get('/', function (req, res) {

  return res.status(200).json(books);

});


// ========================================
// GET BOOK BY ISBN
// ========================================

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ========================================
// GET BOOKS BY AUTHOR
// ========================================

public_users.get('/author/:author', function (req, res) {

  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  return res.status(200).json(result);

});


// ========================================
// GET BOOKS BY TITLE
// ========================================

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );

  return res.status(200).json(result);

});


// ========================================
// GET BOOK REVIEW
// ========================================

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });

});


// ========================================
// TASK 11
// AXIOS + ASYNC/AWAIT + PROMISE
// ========================================


// Get all books using Async/Await

async function getAllBooks() {

  try {

    const response = await axios.get("http://localhost:5000/");

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error("Error retrieving all books:", error.message);

  }

}


// Get book by ISBN using Promise

function getBooksByISBN(isbn) {

  return axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {

      console.log(response.data);

      return response.data;

    })
    .catch(error => {

      console.error("Error retrieving book by ISBN:", error.message);

    });

}


// Get books by author using Async/Await

async function getBooksByAuthor(author) {

  try {

    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error("Error retrieving books by author:", error.message);

  }

}


// Get books by title using Async/Await

async function getBooksByTitle(title) {

  try {

    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    console.log(response.data);

    return response.data;

  } catch (error) {

    console.error("Error retrieving books by title:", error.message);

  }

}


// Export Express router

module.exports.general = public_users;


// Export Task 11 functions

module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;