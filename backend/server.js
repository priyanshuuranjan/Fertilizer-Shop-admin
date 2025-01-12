import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

//  database
connectDB();

app.get("/", (req, res) => {
  res.send("API Working");
});

// server started
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
