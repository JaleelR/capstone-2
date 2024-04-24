"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
// require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
console.log(SECRET_KEY);
const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    if (process.env.env === "production") {
        return process.env.DATABASE_URL;
    } else {
        return process.env.DATABASE_URL || "postgresql://jaleelwhaley:naruto8@localhost:5432/moneymanager";
    }
}


// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Money Manager Config:".green);
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());
console.log("BCRYPT_WORK_FACTOR", BCRYPT_WORK_FACTOR);
console.log("Database:", getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};
