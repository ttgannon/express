/** Database setup for BizTime. */

const { Client } = require('pg');
const DB_URI = (process.env.NODE_ENV === "test") 
    ? "postgresql:///biztime_test"
    : "postgresql:///biztime"



// db is new client with the connection to the db; 
let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db


