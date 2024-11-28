const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const {JWT_SECRET_KEY} = require('../utils/constants');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.some((user) => user.username === username)
}

const authenticatedUser = (username,password)=>{
  return users.some((user) => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in. Missing username or password!' });
  }
  
  if (authenticatedUser(username, password)) {
    const user = { username, password }
    const accessToken = jwt.sign({ user }, JWT_SECRET_KEY, { expiresIn: 60 * 60 })
    
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({ message: 'User successfully logged in.' });
  } else {
    return res.status(208).json({ message: 'Invalid Login. Check username and password, seems that user is not registered.' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { user: { username } } = req.user
  const { isbn } = req.params
  const { review } = req.body
  
  if (!review) {
    return res.status(400).json({ message: 'Review is missing in body!' })
  }
  
  const book = books[isbn]
  if (!book){
    return res.status(404).json({message: `Book with this ${isbn} ISBN not found!`});
  }
  
  book.reviews = { ...book.reviews, [username]: { review } }
  
  return res.status(200).json(book);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { user: { username } } = req.user
  const { isbn } = req.params
  
  const book = books[isbn]
  if (!book){
    return res.status(404).json({message: `Book with this ${isbn} ISBN not found!`});
  }
  
  if (!book.reviews[username]){
    return res.status(404).json({ message: `User ${username} has not reviewed this book!`});
  }
  
  delete book.reviews[username]
  
  return res.status(200).json(book);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
