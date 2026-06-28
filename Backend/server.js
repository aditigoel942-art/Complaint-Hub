const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connect
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

// Health check
app.get("/", (req, res) => res.send("ComplaintHub API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
