const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const headerRoutes = require('./routes/header');
const connectDB = require('./config/db');
const bannerRoutes = require("./routes/banner");
const heroTextRoutes = require("./routes/heroText");
const initiativeRoutes = require("./routes/initiativeRoutes");
const footerRoutes = require("./routes/footer");
const cookieParser = require('cookie-parser');
const enquiryRoutes = require('./routes/enquiryRoutes');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors({
    origin: '*',  // Allow all origins for now, restrict as needed
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
}));

// Middleware for static files (if needed, like serving HTML, CSS, JS files)
app.use(express.static('public')); // Ensure you have a 'public' directory for static content

// Add cookieParser middleware
app.use(cookieParser());

// Add session middleware (ensure you have the SESSION_SECRET in your .env)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,  // Only if you're using HTTPS
        sameSite: 'none',  // Required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/header', headerRoutes);
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
app.listen(5000, '147.79.66.243', () => {
    console.log(`Server running on porttt ${PORT}`);
});
