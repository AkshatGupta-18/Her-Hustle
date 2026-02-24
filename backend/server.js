const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const applicationRoutes = require('./routes/applicationRoutes');



const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/user.routes');


const app = express();

// CORS (adjust port if NOT using Vite)
app.use(
  cors({
    origin: 'http://localhost:5173', // change to 3000 ONLY if your frontend runs there
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));



app.use('/api/applications', applicationRoutes);

// User auth routes
app.use('/api/user', userRoutes);

// Job routes
app.use('/api/jobs', jobRoutes);


app.get('/', (req, res) => res.send('Server started 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


