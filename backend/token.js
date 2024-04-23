const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");

/** return signed JWT from user data. */

function createToken(user) {
    let payload = {
        username: user.username || false,
    };
    console.log("Payload:", payload); // Add this line for debugging

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { 
createToken
}