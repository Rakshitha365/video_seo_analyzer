const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const allRoutes = require("./routes/allRoutes");
const db = require("./db");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use CORS to allow requests from the frontend
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
db();

app.use("/api", allRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
