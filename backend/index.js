const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Routes = require("./routes/route.js");

// Load environment variables from .env file
dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Debug: Log the environment variables to ensure they are being loaded correctly
if (!MONGO_URL) {
  console.error("Error: MongoDB connection URL is not defined in the .env file.");
  process.exit(1); // Exit the server if the MongoDB URL is missing
}

console.log("Environment Variables:");
console.log(`PORT: ${PORT}`);
console.log(`MONGO_URL: ${MONGO_URL}`);

// MongoDB Connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB. Error:", err);
    process.exit(1); // Exit the server if there's a connection issue
  });

// Define Routes
app.use('/', Routes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
