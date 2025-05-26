import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';

dotenv.config() // Load env variables

connectDB(); // Connect to MongoDB

const app  = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8000, ()=>{
    console.log('server running on port 8000');
})