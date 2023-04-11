const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const express = require('express')
const router = require('./routes/routes')

const PORT = process.env.PORT || 8080
const app = express()

// CORS
const whitelist = ['http://localhost:3000', 'http://rt-v-skid.atpr.local:3000']

httpsOptions = {
	key: fs.readFileSync('./private.key'),
	cert: fs.readFileSync('./certificate.crt'),
}

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(router)

https.createServer(httpsOptions, app).listen(PORT, () => {
	console.log(`Server has been started on PORT ${PORT}`)
})
