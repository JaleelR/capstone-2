const dotenv = require("dotenv"); 
const env = process.env.env; 

let BCRYPT_WORK_FACTOR;  
if (env === "production") { 
    BCRYPT_WORK_FACTOR = process.env.env === "test" ? 1 : 12;
    return dotenv.config({ path: '.env.production' })
} else if (env === "test") { 
    return dotenv.config({ path: '.env.test' })
} else { 
    BCRYPT_WORK_FACTOR = process.env.env === "test" ? 1 : 12;
    return dotenv.config({ path: '.env.development' })
}



module.exports = { 
BCRYPT_WORK_FACTOR 

}