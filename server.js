const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/authRoutes');
const headerRoutes = require('./routes/header');  // Import header routes
const connectDB = require('./config/db');  // Import the DB connection from db.js
const bannerRoutes = require("./routes/banner");
const heroTextRoutes = require("./routes/heroText");
const initiativeRoutes = require("./routes/initiativeRoutes");
const footerRoutes = require("./routes/footer"); // Import footer routes
const cookieParser = require('cookie-parser');
const enquiryRoutes = require('./routes/enquiryRoutes');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();  // Call the function to connect to MongoDB

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors({
    origin: '*',  // Allow all origins
    // origin: [
    //     'https://paharpur-frontend-adminpanel.vercel.app',
    //     'https://pahar-pur-frontend.vercel.app',
    //     'https://paharpur-admin-fend.vercel.app'
    // ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
}));

// Add cookieParser middleware
app.use(cookieParser());

// Add cookie session settings if you're using it
app.use(session({
    secret: process.env.SESSION_SECRET,  // Make sure this is defined in your .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,  // Ensure you're using HTTPS
        sameSite: 'none',  // Required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        partitioned: true // Add this for Chrome's new cookie policy
    }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/header', headerRoutes);  // Handle header-related API requests
app.use('/api/banner', bannerRoutes);
app.use('/api/hero-text', heroTextRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/footer', footerRoutes); 
app.use('/api/enquiries', enquiryRoutes);

// Test CORS route
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Root route to test server
app.get('/', (req, res) => {
    res.send('Welcome to the Paharpur Server!');
});

// Start Server and listen on all interfaces
const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
