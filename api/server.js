/* eslint-disable comma-dangle */
/* eslint-disable quotes */
const express = require("express");
// Line 1
const port = process.env.PORT || 5000; // Line 3

// This displays message that the server running and listening to specified port
const app = express();

// middleware for allowing react to fetch() from server
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS");
  next();
});
app.listen(port, () => console.log(`Listening on port ${port}`)); // Line 6

// create a GET route
app.post("/express_backend", (req, res) => {
  // Line 9
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" }); // Line 10
}); // Line 11
