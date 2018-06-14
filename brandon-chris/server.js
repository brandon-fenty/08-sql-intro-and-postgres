'use strict';

const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

// DONE - TODO: Install and require the NPM package pg and assign it to a variable called pg.
const pg = require('pg');

// Windows and Linux users: You should have retained the user/password from the pre-work for this course.
// Your OS may require that your conString (connection string, containing protocol and port, etc.) is composed of additional information including user and password.
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
// For example...
// const conString = 'postgres://postgres:1234@localhost:5432/kilovolt'

// Mac:
const conString = 'postgres://localhost:5432/kilovolt';

// DONE - TODO: Pass the conString into the Client constructor so that the new database interface instance has the information it needs
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app can parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new-article', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js, if any, is interacting with this particular piece of `server.js`? What part of CRUD, if any, is being enacted/managed by this particular piece of code?

  // This app.get is triggered when the user(1) enters a url with the path of new-article(2), the server will then look for the file in the public directory (6), it will then serve the file to the browser (5) 
  response.sendFile('new.html', { root: './public' });
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  
  // When the browser requests files from the articles directory (2), the server queries database (3) and gets a response back from the database (4), the server then sends it to the browser (5, 1). The method that is interacting with the server here is the Article.fetchAll method. The part of CRUD that is being enacted here is READ.

  let SQL = 'SELECT * FROM articles';
  client.query(SQL) // DONE - TODO:
    .then(function(result) {
      response.send(result.rows);
      console.log('get successful');
    })
    .catch(function(err) {
      console.error(err)
      console.log('get failed');
    })
});

app.post('/articles', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  
  // The browser initiates a post to /articles (2), then the server will insert the new post into articles on the database (3), then the server waits for a response from the database that the insert is complete (4), then it sends a response to the browser (5). If it was successful, the response will be sent to the user, otherwise an error will be logged to the console. The piece of article.js that interacts with the server here is the insertRecord method, the CRUD operation used here is CREATE.

  let SQL = `
    INSERT INTO articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;

  let values = [
    request.body.title,
    request.body.author,
    request.body.authorUrl,
    request.body.category,
    request.body.publishedOn,
    request.body.body
  ]

  client.query(SQL, values)
    .then(function() {
      response.send('insert complete')
    })
    .catch(function(err) {
      console.error(err);
    });
});

app.put('/articles/:id', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
 
  // This method is used when the browser requests to update a single article, it will send the request to the server (2), then the server will query the database with a specific id number to update (3), the server waits for a response from the database (4), then the server will send a response to the browser telling the user the update has completed or log an error to the console if it was unable to update (5). The method from article.js that handles this request is updateRecord() and this is the UPDATE operation in CRUD.

  // DONE - TODO:
  let SQL = 'UPDATE articles SET title=$2, author=$3, "authorUrl"=$4, category=$5, "publishedOn"=$6, body=$7 WHERE article_id=$1;';
  let values = 
  [request.params.id,
    request.body.title,
    request.body.author,
    request.body.authorUrl,
    request.body.category,
    request.body.publishedOn,
    request.body.body];

  client.query(SQL, values)
    .then(() => {
      response.send('update complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles/:id', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  
  // This method is used when the browser requests to delete a single article, it will send the request to the server (2), then the server will query the database with a specific id number to delete (3), the server waits for a response from the database (4), then the server will send a response to the browser telling the user the delete has completed or log an error to the console if it was unable to delete (5). The method that is used to complete this function is deleteRecord() and this is the DESTROY operation of CRUD.

  let SQL = `DELETE FROM articles WHERE article_id=$1;`;
  let values = [request.params.id];

  client.query(SQL, values)
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles', (request, response) => {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  
  // This method is used when the browser requests to delete every article, it will send the request to the server (2), then the server will query the database to delete all the articles (3), the server waits for a response from the database (4), then the server will send a response to the browser telling the user the delete has completed or log an error to the console if it was unable to delete (5). The method that is used to complete this function is truncateTable() and this is the DESTROY operation of CRUD.

  let SQL = 'DELETE FROM articles;';
  client.query(SQL)
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

// DONE - COMMENT: What is this function invocation doing?

// This invocation will call the loadDB function which will check to see if a table is present, if there is no table, it will create one, then it will invoke the function loadArticles()

loadDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  
  // This function will be triggered by the loadDB method, when it is initiated, this will query the server (3) then wait for a response, the server will respond with the query results (4) stating whether there are records present or not. If not present, it will pull the hackerIpsum JSON file from the public directory (6), it will then parse the ipsum object into the server (3).

  let SQL = 'SELECT COUNT(*) FROM articles';
  client.query(SQL)
    .then(result => {
      // REVIEW: result.rows is an array of objects that PostgreSQL returns as a response to a query.
      // If there is nothing on the table, then result.rows[0] will be undefined, which will make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
      // Therefore, if there is nothing on the table, line 158 will evaluate to true and enter into the code block.
      if (!parseInt(result.rows[0].count)) {
        fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            let SQL = `
              INSERT INTO articles(title, author, "authorUrl", category, "publishedOn", body)
              VALUES ($1, $2, $3, $4, $5, $6);
            `;
            let values = [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body];
            client.query(SQL, values);
          })
        })
      }
    })
}

function loadDB() {
  // DONE - COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?

  // This method is used when the script loads in the article.js file, it will send a request to the server (2) followed by a  query to the database (3) to check if a SQL table is already present, the server waits for a response from the datatbase (4), then the server will send a response to the browser after determining whether a table is present or not (if a table is not present, it will create one) (5). After the browser receives the response, then it will invoke the loadArticles() method.

  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`)
    .then(() => {
      loadArticles();
    })
    .catch(err => {
      console.error(err);
    });
}