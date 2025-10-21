const dotenv = require('dotenv');
dotenv.config();
console.log("MONGO_URL =", process.env.MONGO_URL);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
const studentRoute = require('./routes/student');
app.use('/api/students', studentRoute);


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/edustats", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.log('MongoDB connection failed ❌', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
