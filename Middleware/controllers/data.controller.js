const db = require('./connectionPG')

class DataController {
	async insertCameraEvent(req, res) {
		await db.query(
			`INSERT INTO data_store.camera_data (matched_object, id_camera, date, id_dossier) 
					VALUES ($1, $2, $3, $4) on conflict do nothing`,
			[
				req.body[0].matched_object,
				req.body[0].camera,
				req.body[0].created_date.split('+')[0],
				req.body[0].matched_dossier,
			]
		)
		res.send(req.body)
		res.status(200).end()
	}
	async supplementCameraEvents(req, res) {
		const currentDate = new Date()
		const day = currentDate.getDate()
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth()

		const url = `http://172.16.3.98/events/faces?limit=1000&created_date_gte=${year}-${
			month.length == 2 ? month : `0${month}`
		}-${day.length == 2 ? day : `0${day}`}T00:00:00.000Z&no_match=false`

		async function getEvents(url) {
			await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization:
						'Token 4107a7122d2bfb6868156327598f058ec9828d15080c6b6980d6f5adb48c4e0b',
				},
			})
				.then(res => {
					return res.json()
				})
				.then(async resBody => {
					console.log('resBody')
					for await (let item of resBody.results) {
						await db.query(
							`INSERT INTO data_store.camera_data (matched_object, id_camera, date, id_dossier)
									VALUES ($1, $2, $3, $4) on conflict do nothing`,
							[
								item.matched_object,
								item.camera,
								item.created_date.split('+')[0],
								item.matched_dossier,
							]
						)
					}
					console.log(resBody)
					if (resBody && resBody.next_page) {
						await getEvents(resBody.next_page)
					}
				})
				.catch(err => console.log(err))
		}

		await getEvents(url)

		res.send()
	}
}

module.exports = new DataController()
