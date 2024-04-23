"use strict";

/** Routes for users. */


const express = require("express");
const { ensureCorrectUser} = require("../auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Transactions = require("../models/plaidApi")
const router = express.Router();



/*
Gets {username} from req.params 
RETURNS {username, firstname, lastname} upon success 
 */

router.get("/:username" , ensureCorrectUser, async function (req, res, next) {
    try {
        const user = res.locals.user;
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/*
Gets {username} from req.params & updated {username, firstname, lastname}
RETURNS {username, firstname, lastname} upon success 
 */
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/*
Gets {username} from req.params 
RETURNS {deleted: username} upon success 
 */
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
