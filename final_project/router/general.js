const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  if (books[req.params.isbn]){
    return res.status(200).json(books[req.params.isbn]);
  }else{
    return res.status(404).json({message: `Book ISBN ${req.params.isbn} not found.`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorToSearch = req.params.author;
  let booksByAuthor = {};
  for (const key of Object.keys(books)){
    if (books[key].author === authorToSearch){
      booksByAuthor[key] = books[key];
    }
  }
  if (Object.keys(booksByAuthor).length > 0){
    return res.status(200).json(booksByAuthor);
  }else{
    return res.status(404).json({message: `Book authered by ${authorToSearch} not found.`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  let bookDetails = {}
  for (const key of Object.keys(books)){
    if (books[key].title == bookTitle){
      bookDetails[key] = books[key];
    }
  }
  console.log(bookDetails);
  if (Object.keys(bookDetails).length > 0){
    return res.status(200).json(bookDetails);
  }else{
    return res.status(404).json({message: `Book with title ${bookTitle} not found.`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
