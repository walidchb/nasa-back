const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


const port = 1938; 

const apodRoute = require("./routes/apodRoute");
const marsRoversRoute = require("./routes/marsRoversRoute");





app.get('/', (req, res) => {
  res.send('Welcome to nasa-back');
});

app.use("/apod", apodRoute);
app.use("/marsRovers", marsRoversRoute);







// Start the server
app.listen(port, () => {
  console.log(`hi nasa-back is running at http://localhost:${port}`);
});

module.exports = app;
