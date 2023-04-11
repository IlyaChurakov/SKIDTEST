import { Request } from 'tedious'
import { dbPG } from '../db_connections/connectionPG'

class RusGuard {
	constructor(db) {
		this.db = db
		this.result = null
	}

	getData() {
		return new Promise(resolve => {
			let request = new Request(
				'SELECT _id, DriverID, EmployeeID, Message, DateTime FROM dbo.Log WHERE DateTime > dateadd(dd,-1,getdate()) FOR JSON PATH',
				err => {
					if (err) {
						console.log(err)
					}
				}
			)

			let string = ''

			request.on('row', columns => {
				columns.forEach((column, num) => {
					return (string += column.value)
				})
			})

			request.on('requestCompleted', async function (rowCount, more) {
				if (string) {
					this.result = JSON.parse(string)

					await this.result.forEach(async item => {
						await dbPG(
							`INSERT INTO data_store.skud_data (id, "ID_controller", "cardNumber", "eventType", date) values ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
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

export default {
	RusGuard,
}
