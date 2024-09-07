
// "use strict";
// /** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// let db;

// if (process.env.NODE_ENV === "production") {
//     db = new Client({
//         connectionString: getDatabaseUri(),
//         ssl: false
//     });
// } else {
//     db = new Client({
//         ssl: true,
//         connectionString: getDatabaseUri()
//     });
// }

// db.connect();

const pg = require('pg')

async function getDb() {
    const { Client } = pg
    const client = new Client()
    await client.connect()

    console.log('>>> DB', client)

    return client
}

// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await client.end()

module.exports = getDb