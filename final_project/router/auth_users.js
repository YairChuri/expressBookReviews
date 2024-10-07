const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const crypto = require('crypto');
const regd_users = express.Router();

let users = [];
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex'); // Generates a 32-byte key and converts it to a hex string
};
const secretKey = generateSecretKey(); // Use a strong secret key

const isValid = (username)=>{ //returns boolean

  const validUsers = users.filter((user) => {
    return (user.username === username);
  })

  if (validUsers.length > 0)
    return true;

  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validUsers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password){
    return res.status(400).json({ message: 'Missing username or password' });
  } 

  if (!isValid(username)){
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, secretKey, { expiresIn: 60*60*1000 });
  req.session.authorization = { token, username }
  return res.status(200).send({ message: `User ${username} successfully logged in`});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.body.review;

  let reviews = books[isbn].reviews;
  reviews[username] = review;

  return res.status(201).json({ 
    message: `Thank you for your review on ${books[isbn].title}.`,
    reviews:  books[isbn].reviews});

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let reviews = books[isbn].reviews;
  if (reviews[username])
    delete reviews[username]

  return res.status(201).json({ 
    message: `Deleted your review on ${books[isbn].title}.`,
    reviews:  books[isbn].reviews});

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.secretKey = secretKey;
