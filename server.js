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


dotenv.config();

const app = express();

// Connect to the database
connectDB();  // Call the function to connect to MongoDB

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors({
    origin: [ "*"
        // 'https://paharpur-frontend-adminpanel.vercel.app',
        // 'https://paharpur-admin-fend.vercel.app',
        // 'https://pahar-pur-frontend.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
}));

// Add these additional settings for cookies
app.use(cookieParser());

// Add cookie session settings if you're using it
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        partitioned: true // Add this for Chrome's new cookie policy
    }
}));

// Use the auth routes
app.use('/api/auth', authRoutes);

// Use the header routes for handling header data
app.use('/api/header', headerRoutes);  // Add this to handle header-related API requests

// Routes
app.use("/api/banner", bannerRoutes);

// Herotext
app.use("/api/hero-text", heroTextRoutes);

// For modal
app.use("/api/initiatives", initiativeRoutes);

// Use the footer routes for handling footer data
app.use("/api/footer", footerRoutes); 

// Add enquiry routes
app.use('/api/enquiries', enquiryRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
