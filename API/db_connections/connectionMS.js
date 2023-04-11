import { Connection } from 'tedious'

const config = {
	server: '172.16.3.101',
	authentication: {
		type: 'default',
		options: {
			userName: 'churakov', //update me
			password: 'Ghbdtncndbt2022#', //update me
		},
	},
	options: {
		instanceName: 'RUSGUARD1',
		trustServerCertificate: true,
		database: 'RusGuardDB', //update me
	},
}

const connection = new Connection(config)

connection.on('connect', function (err) {
	if (err) {
		console.log(err)
	} else {
		console.log('Connected MSSQL')
	}
})

connection.connect()

const dbMS = connection

export default { dbMS }
