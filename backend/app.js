"use strict";

require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const { NotFoundError, UnauthorizedError } = require("./expressError");
const User = require("./models/user");
const morgan = require("morgan");
const plaidRoutes = require("./routes/plaidApi");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const { authenticateJWT } = require("./auth");
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json()); // Using bodyParser for JSON parsing
app.use(morgan("tiny"));
app.use(authenticateJWT); 
// Set cookies with SameSite, Secure, and HttpOnly attributes
app.use((req, res, next) => {
    // Populate res.locals.user with the decoded token payload if available
    if (req.user) {
        res.locals.user = req.user;
        console.log("req.user", req.user)
    }
    next();
});

// Routes
// Apply the authenticateJWT middleware only after the routes that don't need it
app.use("/auth", authRoutes);
// Apply the middleware after excluding it for /auth routes
app.use("/plaid", plaidRoutes);
app.use("/users", usersRoutes);

// Error Handling Middleware
app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

module.exports = app;
