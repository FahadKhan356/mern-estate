import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';  

dotenv.config();

// Use public DNS servers to improve SRV resolution for MongoDB Atlas.
dns.setServers(['1.1.1.1', '8.8.8.8']);

const rawMongoUri = process.env.MONGO || '';
const MONGO_URI = rawMongoUri.trim().replace(/^"(.+)"$/, '$1') ||
  'mongodb+srv://sahand:sahand@mern-estate.eft0pfw.mongodb.net/mern-estate?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000, 
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('Connection Error: ', err));

const app = express();
app.use(express.json());
app.listen(5040, () => {
  console.log('Server is running on port 5040');
});

app.use('/api/user',userRoutes);  
app.use('/api/auth',authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
   return res.status(statusCode).json({
    success: "false",
    message,
    statusCode,
   })
  });


// app.get('/',); 