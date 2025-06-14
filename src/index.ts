import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import connectDB from './config/db';
import authRoutes from './routes/auth'
import propertyRoutes from './routes/properties';
import favouriteRoutes from './routes/favourites';
import { connectRedis } from './config/redis';

dotenv.config() // Load env variables

connectDB(); // Connect to MongoDB
connectRedis(); // Connect to Redis

const app  = express();

// Initial Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Middlewares
app.use(cors());
// Browsers enforce a security policy called Same-Origin Policy, which blocks requests from frontend apps 
// running on a different domain or port than your backend.
app.use(express.json());
// Parses incoming request bodies with JSON payloads and makes it available as req.body.
// JSON data  in the request body, Express by default can’t read it unless you use this middleware.

// Register + Login routes 
app.use("/auth", authRoutes);
app.use("/property", propertyRoutes);
app.use("/favourites",favouriteRoutes);

app.listen(8000, ()=>{
    console.log('server running on port 8000');
})

