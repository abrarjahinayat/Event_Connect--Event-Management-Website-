const express = require('express');
const dbConnection = require('./src/config/dbconfig');
const path = require('path');  // ✅ ADD THIS LINE

require('dotenv').config();
const router = require('./src/route');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to the database
dbConnection();

// ✅ FIXED: Replace your line 19 with this:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// router connection
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`📁 Static files: http://localhost:${port}/uploads/`);
});