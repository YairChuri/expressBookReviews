const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password}  = req.body;
  if (!username || !password){
    return res.status(400).json({ message: 'Missing username or password' });
  } 

  if (users.find(user => user.username === username)){
    return res.status(200).json({ message: 'User already exists' });
  }

  users.push({username, password});
  return res.status(200).json({ message: `User ${username} added.` });
});

function fetchBooksFromDatabase() {
  return new Promise((resolve, reject) => {
    resolve(books); 
  });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const booksFromDb = await fetchBooksFromDatabase(); 
    return res.status(200).json(booksFromDb); 
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

function fetchBooksByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]){
      resolve(books[isbn]); 
    }
    reject(`Book ISBN ${isbn} not found.`)
  });
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
    const booksFromDb = await fetchBooksByISBN(req.params.isbn);
    return res.status(200).json(booksFromDb);
  }catch(error){
    return res.status(404).json({message: error});
  }
 });

function fetchBooksByAuthor(author){
  return axios.get("https://reqres.in")
    .then(response =>{
      let booksByAuthor = {};
      for (const key of Object.keys(books)){
        if (books[key].author === author){
          booksByAuthor[key] = books[key];
        }
      }
      return booksByAuthor;
    })
    .catch(error =>{
      throw error;
    });
} 
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try{
    const booksByAuthor = await fetchBooksByAuthor(req.params.author);
    return res.status(200).json(booksByAuthor);
  }catch(error){
    return res.status(404).json({message: error});
  }

});
function fetchBooksByTitle(title){
  return axios.get("https://reqres.in")
    .then(response =>{
      let booksByTitle = {}
      for (const key of Object.keys(books)){
        if (books[key].title == title){
          booksByTitle[key] = books[key];
        }
      }
      return booksByTitle;
    })
    .catch(error =>{
      throw error;
    })
  }
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try{
    const booksByTitle = await fetchBooksByTitle(req.params.title);
    return res.status(200).json(booksByTitle);
  }catch(error){
    return res.status(404).json({message: error});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  }else{
    return res.status(404).json({message: `Book ISBN ${req.params.isbn} not found.`});
  }
});

module.exports.general = public_users;
