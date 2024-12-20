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

// Single body-parser middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Single logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    next();
});

// CORS configuration
app.use(cors({
    origin: ['https://admin.adsu.shop', 'https://adsu.shop', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
}));

// Add this before your routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin.includes('adsu.shop')) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Allow-Credentials');
    next();
});

// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Required for HTTPS
        sameSite: 'none', // Required for cross-subdomain
        httpOnly: true,
        domain: '.adsu.shop', // This will work for both main domain and subdomains
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
}));

// Routes
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

app.post('/debug', (req, res) => {
    console.log('Incoming body:', req.body);
    res.json({ body: req.body });
});

app.post('/debug-test', (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Raw Body:', req.body);
    res.json({
        receivedBody: req.body,
        contentType: req.headers['content-type']
    });
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);  // Ensure this is not undefined

// Start Server and listen on all interfaces
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
