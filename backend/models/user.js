"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/


    static async getAllUsers() {
        const usersRes = await db.query(
            `SELECT id, username,
              first_name AS "firstName",
              last_name AS "lastName"
         FROM users`
        );

        const users = usersRes.rows;

        if (!users) throw new NotFoundError("No users found");

        return users;
    };

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT id, username,
                  password,
                  auth_token,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];
                console.log("authenticated User:", user)
        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    };

    /** Register user with data.
     *
     * Returns { username, firstName, lastName }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, firstName, lastName}) {
        const duplicateCheck = await db.query(
            `SELECT username
           FROM users
           WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (username,
            password,
          
            first_name,
            last_name
            )
           VALUES ($1, $2, $3, $4)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName"`,
            [
                username,
                hashedPassword,
                firstName,
                lastName
            ],
        );

        const user = result.rows[0];

        return user;
    };

    static async updateAccessToken(username, plaid_token) {
        const result = await db.query(
            `UPDATE users 
        SET plaid_token = $2
        WHERE username = $1
        RETURNING username`,
            [username, plaid_token]
        );
        const user = result.rows[0];
        if (!user) throw new NotFoundError(`No user found for username: ${username}`);
    }


    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name }
     *
     * Throws NotFoundError if user not found.
     **/

    static async getUser(username) {
        const userRes = await db.query(
            `SELECT id, username,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    };

    /** Given a username, return token of user.
     * 
      *
      * Returns { Token}
      *
      * Throws NotFoundError if user not found.
      **/
    static async getPlaidToken(username) { 
        const userToken = await db.query(
            `SELECT plaid_token FROM users WHERE username = $1`, [username],
        );
        const plaidToken = userToken.rows[0];
        if (!plaidToken) throw new NotFoundError(`no plaid_token found`); 

        return plaidToken.plaid_token;
    }
    

    static async saveAuthToken(auth_token, username) {
        const userToken = await db.query(
            `UPDATE users SET auth_token = $1 WHERE username = $2 RETURNING auth_token`,
            [auth_token, username],
        );
        const authToken = userToken.rows[0];
        if (!authToken) throw new NotFoundError(`no auth_token found for username: ${username}`);

        return authToken.auth_token;
    }



    static async getAuthToken(auth_token) {
        const userToken = await db.query(
            `SELECT auth_token FROM users WHERE auth_token = $1`, [auth_token], // Selecting the entire auth_token
        );
        const user = userToken.rows[0];
        if (!user) throw new NotFoundError(`no user found for auth_token`);
        return user.auth_token; // Returning the entire auth_token
    }



    // /** Update user data with `data`.
    //  *
    //  * This is a "partial update" --- it's fine if data doesn't contain
    //  * all the fields; this only changes provided ones.
    //  *
    //  * Data can include:
    //  *   { firstName, lastName, password, email, isAdmin }
    //  *
    //  * Returns { username, firstName, lastName, email, isAdmin }
    //  *
    //  * Throws NotFoundError if not found.
    //  *
    //  * WARNING: this function can set a new password or make a user an admin.
    //  * Callers of this function must be certain they have validated inputs to this
    //  * or a serious security risks are opened.
    //  */

    // static async update(username, data) {
    //     if (data.password) {
    //         data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    //     }

    //     const { setCols, values } = sqlForPartialUpdate(
    //         data,
    //         {
    //             firstName: "first_name",
    //             lastName: "last_name",
    //             isAdmin: "is_admin",
    //         });
    //     const usernameVarIdx = "$" + (values.length + 1);

    //     const querySql = `UPDATE users 
    //                   SET first_name, last_name
    //                   WHERE username = ${usernameVarIdx} 
    //                   RETURNING username,
    //                             first_name AS "firstName",
    //                             last_name AS "lastName",
    //                             email,
    //                             is_admin AS "isAdmin"`;
    //     const result = await db.query(querySql, [...values, username]);
    //     const user = result.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);

    //     delete user.password;
    //     return user;
    // }

    /** Delete given user from database; returns undefined. */

    static async remove(username) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
            [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }
}


module.exports = User;
