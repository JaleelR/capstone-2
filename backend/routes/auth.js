const express = require("express");

const User = require("../models/user");
const router = express.Router();
const { createToken } = require("../token");
const { UnauthorizedError } = require("../expressError");

/*
Gets {username, password, firstname and lastname} from req.body 
returns a token for accessabilty for the rest of the code
 */

router.post("/register", async function (req, res, next) {
    try {
        const { username, password, firstName, lastName } = req.body;

       
        // Register the new user
        const user = await User.register({ username, password, firstName, lastName });

        // Generate a token
        const token = createToken({ username: user.username });

        // Store the token in the database
        const authToken = await User.saveAuthToken(token, username);

        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});



router.post("/token", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        console.log("user_tok", user.auth_token);
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        };
        const token = createToken({ username: user.username });

        console.log("usertok2", token)
        res.locals.authToken = token;
        console.log("secondtolasttoken", res.locals.authToken)
        // store in the DB with the user row
        const authToken = await User.saveAuthToken(token, username);
        console.log("authToken",  authToken)
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});





module.exports = router;