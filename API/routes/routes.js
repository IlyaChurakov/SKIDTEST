const { query } = require('express')
const Router = require('express')
const dataController = require('../controllers/data.controller')
const dbPG = require('../db_connections/connectionPG')
const router = new Router()
const { readFile } = require('fs')

router.get('/positions/:floor', dataController.getPositions)
router.get('/position/:name', dataController.getEmployeePosition)
router.get(
	'/employeesStatistic/:startDate/:endDate',
	dataController.getEmployeesStatistic
)
router.get(
	'/personStatistic/:startDate/:endDate/:name',
	dataController.getPersonStatistic
)
router.get(
	'/departments/:startDate/:endDate/:name',
	dataController.getDepartments
)
router.get(
	'/departmentEmployees/:startDate/:endDate/:department',
	dataController.getDepartmentEmployees
)
router.get(
	'/department/:startDate/:endDate/:department',
	dataController.getDepartment
)
router.get('/employee/:startDate/:endDate/:name', dataController.getEmployee)
router.get(
	'/employeeCameraEvents/:startDate/:endDate/:name',
	dataController.getEmployeeCameraEvents
)
router.get(
	'/employeeDoorEvents/:startDate/:endDate/:name',
	dataController.getEmployeeDoorEvents
)
router.get('/finder/:txt', dataController.findNames)

setInterval(async () => {
	const obj = {
		absences: [],
	}

	const forin = async () => {
		for (let item of obj.absences) {
			await fetch(
				`https://bitrix.rt-techpriemka.ru/rest/307/x1hvk8efs0gk0xfz/user.get.json?ID=${String(
					item.createdBy
				)}`
			)
				.then(res => {
					return res.json()
				})
				.then(resBody => {
					if (resBody.result[0].UF_USR_1679379385365) {
						dbPG.query(
							`INSERT INTO data_store.c_absences
							(cardnumber, start_date, end_date, typeofabsence, id)
							VALUES ($1, $2, $3, $4, $5) on conflict do nothing`,
							[
								resBody.result[0].UF_USR_1679379385365, // табельный номер
								item.ufCrm14_1629993971, // дата начала (string)
								item.ufCrm14_1629994007, // дата конца (string)
								item.ufCrm14_1629994055, // id типа отсутствия
								item.id, // id типа отсутствия
							]
						)
					}
				})
				.catch(err => console.log(err))
		}
	}
	await fetch(
		`https://bitrix.rt-techpriemka.ru/rest/307/6zhir45vw1merkyl/crm.item.list`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				entityTypeId: 169,
				order: {
					id: 'DESC',
				},
				filter: {
					stageId: 'DT169_26:SUCCESS',
				},
			}),
		}
	)
		.then(res => {
			return res.json()
		})
		.then(resBody => {
			obj.absences = resBody.result.items
			forin()
		})
		.catch(err => console.log(err))
}, 180000)

// router.get('/bitrix24/:id', async (req, res) => {
// 	const obj = {
// 		absences: [],
// 	}

// 	const forin = async () => {
// 		for (let item of obj.absences) {
// 			await fetch(
// 				`https://bitrix.rt-techpriemka.ru/rest/307/x1hvk8efs0gk0xfz/user.get.json?ID=${String(
// 					item.createdBy
// 				)}`
// 			)
// 				.then(res => {
// 					return res.json()
// 				})
// 				.then(resBody => {
// 					if (resBody.result[0].UF_USR_1679379385365) {
// 						dbPG.query(
// 							`INSERT INTO public.c_absences
// 							(cardnumber, start_date, end_date, typeofabsence, id)
// 							VALUES ($1, $2, $3, $4, $5) on conflict do nothing`,
// 							[
// 								resBody.result[0].UF_USR_1679379385365, // табельный номер
// 								item.ufCrm14_1629993971, // дата начала (string)
// 								item.ufCrm14_1629994007, // дата конца (string)
// 								item.ufCrm14_1629994055, // id типа отсутствия
// 								item.id, // id типа отсутствия
// 							]
// 						)
// 					}
// 				})
// 				.catch(err => console.log(err))
// 		}
// 	}
// 	await fetch(
// 		`https://bitrix.rt-techpriemka.ru/rest/307/6zhir45vw1merkyl/crm.item.list`,
// 		{
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 				entityTypeId: 169,
// 				order: {
// 					id: 'DESC',
// 				},
// 				filter: {
// 					stageId: 'DT169_26:SUCCESS',
// 				},
// 			}),
// 		}
// 	)
// 		.then(res => {
// 			return res.json()
// 		})
// 		.then(resBody => {
// 			obj.absences = resBody.result.items
// 			forin()
// 		})
// 		.catch(err => console.log(err))

// 	res.send(obj.personCard)
// })
router.get('/bitrix24/:id', async (req, res) => {
	// Будет доставать данные из БД и отдавать их в UI

	res.send(obj.body)
})

// // Получение данных из файла выгрузки 1С:ЗУП

const currentDate = new Date()

// let day =
// 		+currentDate.getDate() < 10
// 			? `0${currentDate.getDate()}`
// 			: currentDate.getDate(),
// 	month =
// 		+currentDate.getMonth() < 10
// 			? `0${currentDate.getMonth() + 1}`
// 			: currentDate.getMonth() + 1,
// 	year = currentDate.getFullYear()

// let date = `${day}.${month}.${year}`
// let yesterday = `${day - 1}.${month}.${year}`

const readData = async filedate => {
	await readFile(`./отсутствия.json`, 'utf8', async function (error, data) {
		if (error) {
			console.log(error)
			console.log('1С: Не удалось прочитать файл выгрузки')
		} else {
			console.log('1C: Файл прочитан')
			dataJson = JSON.parse(data)

			try {
				for (let item in dataJson.Departments) {
					await dbPG.query(
						`INSERT INTO data_store.c_departments (id, name, deleted, parent) values ($1, $2, $3, $4) on conflict do nothing`,
						[
							dataJson.Departments[item].ID,
							dataJson.Departments[item].Name,
							dataJson.Departments[item].Deleted,
							dataJson.Departments[item].Parent,
						]
					)
				}
			} catch (e) {
				console.log(e)
			}
			try {
				for (let item in dataJson.Employees) {
					await dbPG.query(
						`INSERT INTO data_store.c_employees (id, name, deleted, department, workingschedule, appointdate) values ($1, $2, $3, $4, $5, $6) on conflict do nothing`,
						[
							dataJson.Employees[item].ID,
							dataJson.Employees[item].Name,
							dataJson.Employees[item].Deleted,
							dataJson.Employees[item].Department,
							dataJson.Employees[item].WorkingSchedule,
							dataJson.Employees[item].AppointDate,
						]
					)
				}
			} catch (e) {
				console.log(e)
			}
			try {
				for (let item in dataJson.Absences) {
					await dbPG.query(
						`INSERT INTO data_store.c_absences (cardnumber, start_date, end_date, typeofabsence) values ($1, $2, $3, $4) on conflict do nothing`,
						[
							dataJson.Absences[item].CardNumber,
							dataJson.Absences[item].StartDate,
							dataJson.Absences[item].EndDate,
							dataJson.Absences[item].TypeOfAbsence,
						]
					)
				}
			} catch (e) {
				console.log(e)
			}
			try {
				for (let item in dataJson.WorkingSchedules) {
					await dbPG.query(
						`INSERT INTO data_store.c_workingschedules (id, name, deleted, "Date", worktimeperday) values ($1, $2, $3, $4, $5) on conflict do nothing`,
						[
							dataJson.WorkingSchedules[item].ID,
							dataJson.WorkingSchedules[item].Name,
							dataJson.WorkingSchedules[item].Deleted,
							dataJson.WorkingSchedules[item].Date,
							dataJson.WorkingSchedules[item].WorktimePerDay,
						]
					)
				}
			} catch (e) {
				console.log(e)
			}

			return JSON.parse(data)
		}
	})
}

setInterval(() => {
	// readData(date)
}, 180000)

module.exports = router
