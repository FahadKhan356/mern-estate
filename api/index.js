import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

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
app.listen(5040, () => {
  console.log('Server is running on port 5040');
});