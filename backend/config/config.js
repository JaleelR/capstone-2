"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
const {BCRYPT_WORK_FACTOR} = require('./config-env')
// require("colors");

// const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
// console.log(SECRET_KEY);
const PORT = +process.env.PORT || 3001;
const Env = process.env.env; 
const database = process.env.DATABASE_URL



// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use

console.log("Money Manager Env:", Env);
// console.log("SECRET_KEY:", SECRET_KEY);
console.log("database", database); 
console.log("PORT:", PORT.toString());
console.log("BCRYPT_WORK_FACTOR", BCRYPT_WORK_FACTOR);
// console.log("Database:", getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};
