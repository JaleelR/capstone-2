const { query } = require("express");
const db = require("../db");
const pgp = require('pg-promise')();

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

let errorLogged = false; // Declare the errorLogged variable outside of the method

class Transactions {
    static async insertTransactions(transaction_id, userId, category, merchant_name, amount, isoCurrencyCode, date, counterparties_name) {
        try {
            const result = await db.query(`
                INSERT INTO Transactions (transaction_id, user_id, category, merchant_name, amount, iso_currency_code, date, counterparties_name)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [transaction_id, userId, category, merchant_name, amount, isoCurrencyCode, date, counterparties_name],
            );

            const transactions = result;

            if (!transactions) {
                throw new UnauthorizedError("Transactions error");
            }

            return transactions;
        }
        catch (error) {
            if (error.code === '23505' && !errorLogged) {
                console.log("---Received the most recent transactions----");
                errorLogged = true;
                return; // Return here to stop further execution
            }
            else if (error.code === '23505' && errorLogged) {
                // Do nothing if the error has already been logged
                return;
            }
            else {
                console.log({ message: error.message });
                return;
            }
        }
    };


    static async getTransactions(userId, startDate, endDate, orderByColumn, orderBy) {
        try {
            const query = `
            SELECT transaction_id, merchant_name, amount, date, iso_currency_code, category
            FROM transactions
            WHERE user_id = $1 AND date >= $2::date AND date <= $3::date
            ORDER BY ${orderByColumn} ${orderBy}
        `;

            const values = [userId, startDate, endDate];
            const result = await db.query(query, values);

            const transactions = result.rows;

            if (!transactions) {
                throw new Error("No transactions found");
            }

            return transactions;
        } catch (error) {
            console.error({ message: error.message });
            return [];
        }
    }

    static async balances(account_id, user_id, balance, name, type) {
        try {
            const result = await db.query(
            `INSERT INTO accounts(account_id, user_id, balance, name, type)
            VALUES($1, $2, $3, $4, $5)
    ON CONFLICT(account_id) DO UPDATE 
    SET balance = $3, name = $4, type = $5
`, [account_id, user_id, balance, name, type]);

            const balances = result.rows;

            if (!balances) {
                throw new UnauthorizedError("Inserting balances error");
            }

            return balance;
        }
        catch (error) {
            if (error.code === '23505' && !errorLogged) {
                console.log("---Received the balances----");
                errorLogged = true;
                return; // Return here to stop further execution
            }
            else if (error.code === '23505' && errorLogged) {
                // Do nothing if the error has already been logged
                return;
            }
            else {
                console.log({ message: error.message });
                return;
            }
        }
    };

    static async getBalances(userId) {
        try {
            const result = await db.query(`
            SELECT account_id, user_id, balance, name, type
            FROM accounts
            WHERE user_id = $1 
        `, [userId]);

            const balance = result.rows;

            if (!balance) {
                throw new Error("No balances found");
            }

            return balance;
        } catch (error) {
            console.error({ message: error.message });
            return [];
        }
    }

}







module.exports = Transactions;
