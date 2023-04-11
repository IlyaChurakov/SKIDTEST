const Request = require('tedious').Request
const db = require('./connectionPG')

class RusGuard {
	constructor(db) {
		this.db = db
		this.result = null
	}

	getData() {
		return new Promise(resolve => {
			let request = new Request(
				'SELECT _id, DriverID, EmployeeID, Message, DateTime FROM dbo.Log WHERE DateTime > dateadd(ww,-1,getdate()) FOR JSON PATH',
				err => {
					if (err) {
						console.log(err)
					}
				}
			)
			let string = ''

			request.on('row', columns => {
				columns.forEach((column, num) => {
					// console.log('Событие в MSSQL появилось')
					return (string += column.value)
				})
			})

			request.on('requestCompleted', async function (rowCount, more) {
				if (string) {
					this.result = JSON.parse(string)

					await this.result.forEach(async item => {
						await db.query(
							`INSERT INTO data_store.skud_data (id, ID_controller, "cardNumber", "eventType", date) values ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
							[
								item._id,
								item.DriverID,
								item.EmployeeID,
								item.Message,
								item.DateTime,
							]
						)
					})
				}
				resolve(this.result)
			})

			this.db.execSql(request)
		})
	}
}

// `SELECT _id, FirstName, SecondName, LastName
// 				FROM dbo.Employee FOR JSON PATH`,
// await db.query(
// 							`INSERT INTO data_store.skud_employees (id_employee, name) values ($1, $2) ON CONFLICT DO NOTHING`,
// 							[
// 								item._id,
// 								`${item.LastName} ${item.FirstName} ${item.SecondName}`,
// 							]
// 						)

module.exports = {
	RusGuard,
}
