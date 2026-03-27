const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const axios = require('axios');

const applicationRoutes = require('./routes/applicationRoutes');
const chatbotRoutes = require('./routes/chatbotroutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/user.routes');

const app = express();

// ✅ CORS first — before everything else
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => res.send('Server started 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));