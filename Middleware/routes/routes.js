const Router = require('express')
const dataController = require('../controllers/data.controller')
const { RusGuard } = require('../controllers/RusGuard')
const { dbMS } = require('../controllers/connectionMS')
const router = new Router()

let data = null

setInterval(async () => {
	data = await new RusGuard(dbMS).getData()

	if ((data != null) & (data != undefined)) {
		console.log('События за последнюю минуту:')
		return data
	} else {
		console.log('RusGuard: Данных нет')
	}
}, 3000)

setInterval(() => {
	const currentDate = new Date()
	const hours = currentDate.getHours()
	if (hours == 23) {
		try {
			dataController.supplementCameraEvents()
		} catch (err) {
			console.log(err)
		}
	}
}, 3300000)

router.post('/hook', dataController.insertCameraEvent)
router.get('/hook', dataController.supplementCameraEvents)

module.exports = router
