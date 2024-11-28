const express = require('express');
let books = require("./booksdb.js");
const {simplifyString} = require('../utils/simplifyString');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
