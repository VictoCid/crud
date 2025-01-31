const {Pool} = require('pg');
const { db } = require('./config')

const base = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.database
})

module.exports = base;