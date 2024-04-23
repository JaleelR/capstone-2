const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Transactions = require("../models/plaidApi");
const { Configuration, PlaidApi, PlaidEnvironments, ConsumerReportPermissiblePurpose } = require('plaid');
const cron = require('node-cron');

const router = express.Router();

//Retrives varibles needed from .env file needed for Plaid api
const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID, // Retrieve from environment variable
            'PLAID-SECRET': process.env.PLAID_SECRET_DEVELOPMENT,
        },
    },
});
const plaidClient = new PlaidApi(configuration);


cron.schedule('0 0 * * *', async () => {
    try {
        // Fetch all users
        const users = await User.getAllUsers(); // Assuming you have a method to get all users

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Iterate through each user and fetch transactions for today's date
        for (const user of users) {
            const userToken = await User.getPlaidToken(user.username);

            // Update transactions
            const transactionsResult = await plaidClient.transactionsGet({
                access_token: userToken,
                start_date: today,
                end_date: today,
            });

            // Process and insert transactions into the database
            for (const transaction of transactionsResult.data.transactions) {
                await Transactions.insertTransactions(
                    transaction.transaction_id,
                    user.id,
                    transaction.category.join(', '),
                    transaction.merchant_name,
                    transaction.amount,
                    transaction.iso_currency_code,
                    transaction.date
                );
            }

            // Fetch account balance from the latest transaction response
            const account = transactionsResult.data.accounts[0]; // Assuming the first account is the desired one
            const balance = account.balances.current;

            // Update the user's balance in the database
            await User.updateBalance(user.id, balance); // Assuming you have a method to update the user's balance

            console.log(`Transactions and balance updated for user: ${user.username}`);
        }
    } catch (error) {
        console.error('Error updating transactions or balance:', error.error_code, error.error_message, error.error_type);
    }
});






/*
Creates a link token to send to Plaid (in usePlaidLink call) to 
open up pop up link to connect bank from Plaid which will make a public token

Returns: public token 
 */

router.post('/create_link_token', async function (request, response) {
    const plaidRequest = {
        user: {
            client_user_id: "user",
        },
        client_name: 'Plaid money Manager app',
        products: ['auth'],
        language: 'en',
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        // handle error
        console.log(error.error_code, error.error_message, error.error_type);
    }
});


/*
Upon succcess of calling creeate_link_token and proper bank information is successfully 
filled out, exchange_public_token will send public token which will be sent to 
plaid to create an access token to use for further plaid api calls 

Returns access Token
 */

router.post('/exchange_public_token', async function (request, response, next) {
    const publicToken = request.body.publicToken;
    const user = response.locals.user;
    console.log("___________user_______", user);
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
       
        const accessToken = plaidResponse.data.access_token;
        //add to user id
        try {
            await User.updateAccessToken(user.username, accessToken);
            console.log("Backend got access token!!!!!!", accessToken)
            // const itemID = response.data.item_id
            response.json({ accessToken, public_token_exchange: 'complete' });
        } catch (e) {
            console.log("updateAccess Token error", e)
        }
    } catch (error) {
        // handle error
        console.log("Error at plaid response___________");
        next(error.error_code, error.error_message, error.error_type);
    }
});

/*
plaid/transactions RETURNS the transactions of the account holder 
 */

// ... existing imports ...

router.get("/transactions", async function (req, res, next) {
    try {
        const user = res.locals.user;
        let { startDate, endDate, orderByColumn, orderBy } = req.query;

        // Extract year and month from startDate
        const [year, month] = startDate.split('-').map(Number);

        // Validate year and month
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            console.error('Invalid year or month:', year, month);
            return res.status(400).json({ error: 'Invalid year or month' });
        }

    
        const userInfo = await User.getUser(user.username);
           console.log("UserInfoooooooooooooooooooooop:", userInfo);


        const transactions = await Transactions.getTransactions(userInfo.id, startDate, endDate, orderByColumn, orderBy);
        console.log("Transactions:", transactions);

        return res.json({ transactions });
    } catch (error) {
        console.error("Error in /transactions route:")
        return next(error.error_code, error.error_message, error.error_type);
    }
});




router.post("/transactions", async function (req, res, next) {
    const getUser = res.locals.user
    console.log("userrrrrrrrrrrrrrrr", getUser)
    const userToken = await User.getPlaidToken(getUser.username);
    console.log(":::::::::::::::::", userToken);
    const user = await User.getUser(getUser.username);

    const startDate = '2022-01-01';  // Start date to fetch transactions
    const endDate = new Date().toISOString().split('T')[0];    // End date to fetch transactions

    try {
        const transactionsResult = await plaidClient.transactionsGet({
            access_token: userToken,
            start_date: startDate,
            end_date: endDate,
        });
        
 
        if (transactionsResult.data.transactions.length > 0) {
            for (const transaction of transactionsResult.data.transactions) {
                const {
                    transaction_id,
                    category,
                    merchant_name,
                    amount,
                    iso_currency_code,
                    date
                } = transaction;

                // Insert the transaction into the database
                await Transactions.insertTransactions(
                    transaction_id,
                    user.id,
                    category.join(', '),
                    merchant_name,
                    amount,
                    iso_currency_code,
                    date
                );
            }

            return res.json({ message: "Transactions saved successfully" });
        } else {
            return res.json({ message: "No new transactions found" });
        }
    } catch (err) {
        console.log("Error fetching or saving transactions:");
        return next(err.error_code, err.error_message, err.error_type);
    }
});




/*
plaid/auth RETURNS basic bank information such as balance, account name, routing and account number, number of accounts, etc
 */

router.post("/auth",   async function (request, response, next) {
    const getUser = response.locals.user;
    console.log("______USER______", getUser)
    try {
        const accessToken = await User.getPlaidToken(getUser.username);
        console.log("ACTUALL accessTOKEN:", accessToken)

        const plaidRequest = {
            access_token: accessToken,
        };

        const plaidResponse = await plaidClient.authGet(plaidRequest);
        console.log("it worked ")
        return response.json(plaidResponse.data);
        // Here you can use the accessToken as needed
        // For example, you can send it back in the response

    } catch (error) {
        console.log("it didnt work")
        next(error.error_code, error.error_message, error.error_type ); // Pass any errors to the error handling middleware
    }
}
);

router.post("/balances", async function (request, response, next) {
    const getUser = response.locals.user;
    console.log(")))))))",getUser.username)
    const user = await User.getUser(getUser.username);
    console.log("______USER______", getUser);

    try {
        const userToken = await User.getPlaidToken(getUser.username);
        console.log("ACTUALL USERTOKEN:", userToken);

        const plaidRequest = {
            access_token: userToken,
        };

        const plaidResponse = await plaidClient.accountsBalanceGet(plaidRequest); // Use accountsBalanceGet instead of getBalance
        

        // Extract and format the account balances
        const balances = plaidResponse.data.accounts.map(account => ({
            accountId: account.account_id,
            balance: account.balances.current,
            name: account.name,
            type: account.type
        }));

        // Loop through balances and update the database
        for (const balance of balances) {
            await Transactions.balances( // Assuming this is the method you want to call to save balances
                balance.accountId,
                user.id,
                balance.balance,
                balance.name,
                balance.type
            );
        }

        return response.json({ message: 'Balances updated successfully' });

    } catch (error) {
        console.log("it didnt work");
        next(error.error_code, error.error_message, error.error_type); // Pass any errors to the error handling middleware
    }
});


router.get("/balances", async function (req, res, next) {
    try {
        const user = res.locals.user;
        const userInfo = await User.getUser(user.username);
        console.log("UserInfo:", userInfo);
        const balances = await Transactions.getBalances(userInfo.id);
        return res.json({ balances});
    } catch (err) {
        console.error("Error in /balance route");
        return next(err.error_code, err.error_message, err.error_type);
    }
});



module.exports = router;
