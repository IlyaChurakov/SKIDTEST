const { Pool } = require('pg')

const pool = new Pool({
	user: 'dba',
	host: '172.16.3.158',
	database: 'skud_va',
	password: '!QAZ2wsx',
	port: 5432,
})

module.exports = pool
