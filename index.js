// index.js — the entry point of our backend server
const express = require('express'); // pull in the Express library
const app = express();              // create our app/server object
const PORT = 3000;                  // the port our server will listen on

// Define a route: when someone visits "/", run this function
app.get('/', (req, res) => {
  res.send('Hello from ShowUp!');
});

// Start the server, listening on PORT
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});