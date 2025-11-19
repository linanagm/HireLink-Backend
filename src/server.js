import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import bootstrap from "./app.controller.js"

// ✅ Load environment variables first
dotenv.config();

// ✅ Port
const PORT = process.env.PORT || 5200;

// ✅ Get hostname
const HOST = "localhost";

// ✅ Create app instance
const app = express();


// ✅ App 
await bootstrap(app , express);


// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
