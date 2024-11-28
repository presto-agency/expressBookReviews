const express = require('express');
const books = require("./booksdb.js");
const {simplifyString} = require('../utils/simplifyString');
const isValid = require("./auth_users.js").isValid;
const { users } = require("./auth_users.js");
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password })
      return res.status(200).json({ message: 'User successfully registered. Now you can login' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  } else {
    return res.status(404).json({message: 'Unable to register user. Missing username or password.'});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params
  try {
    const book = books[isbn]
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: `Book with this ${isbn} ISBN not found!`});
    }
  } catch (error) {
    console.log(`Error with isbn request: ${error}`)
    return res.status(500).json({ error: error.message })
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const { author } = req.params
    
    const filteredBooks = Object.values(books).filter(book => simplifyString(book.author) === simplifyString(author))
    
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks)
    } else {
      return res.status(404).json({ error: `No books found with this author '${author}'` })
    }
  } catch (error) {
    console.log(`Error with author request: ${error}`)
    return res.status(500).json({ error: error.message })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    const { title } = req.params
    
    const filteredBooks = Object.values(books).filter(book => simplifyString(book.title) === simplifyString(title))
    
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks)
    } else {
      return res.status(404).json({ error: `No books found with this title '${author}'` })
    }
  } catch (error) {
    console.log(`Error with title request: ${error}`)
    return res.status(500).json({ error: error.message })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const { isbn } = req.params
    
    const book = books[isbn]
    
    if (book) {
      return res.status(200).json(book.reviews)
    } else {
      return res.status(404).json({ error: `No books found with this ISBN '${isbn}'` })
    }
  } catch (error) {
    console.log(`Error with review request: ${error}`)
    return res.status(500).json({ error: error.message })
  }
});

// With Axios, Tasks 10 - 13

const apiURL = 'http://localhost:4000'

// Get the book list available in the shop, using axios
public_users.get('/v2', async (req, res) => {
  try {
  const { data } = await axios.get(`${apiURL}/`)
    res.status(200).json(data)
  } catch (error) {
    console.log(`Error with books request: ${error}`)
    return res.status(500).json({ error: error.message })
  }
})

// Get book details based on ISBN, using promise
public_users.get('/v2/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params
  
  const getBooks = new Promise((resolve, reject) => {
    try {
      resolve(books)
    } catch (error) {
      console.log(`Error with books request: ${error}`)
    }
  })
  
  getBooks.then((response) => {
    const book = response[isbn]
    
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: `Book with this ${isbn} ISBN not found!`});
    }
  })
})

module.exports.general = public_users;
