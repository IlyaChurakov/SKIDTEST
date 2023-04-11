const dbPG = require('../db_connections/connectionPG')

class DataController {
	async getEmployeesStatistic(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd

		console.log(startDate, endDate)

		const data = await dbPG.query(
			`SELECT
				d.short_name  ,
				e."name" ,
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round ( (extract (epoch from date_trunc('second', avg (wm.working_time))) / extract (epoch from time '08:00') *100), 2) AS avg_working_time ,
				round (avg (wm.work_time_zone), 2)
			FROM dds.work_mart wm
			LEFT JOIN dds.departments d ON d.short_name = wm.parent_dept
			LEFT JOIN dds.employees e ON e.dept_id = d.dept_id
			WHERE date between date '${startDate}' and date '${endDate}'
				AND d.short_name is not null
			GROUP BY d.short_name, e."name", wm.lvl
			ORDER BY wm.lvl asc`
		)

		res.send(data.rows)
	}
	async getPersonStatistic(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const name = req.params.name

		const data = await dbPG.query(
			`SELECT 
				d.short_name  ,
				e."name" ,
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round ((extract(epoch from (date_trunc('second', avg (wm.working_time)))) / extract (epoch from time '08:00')* 100), 2) AS avg_working_time ,
				round (avg (wm.work_time_zone), 2) AS round
			FROM dds.work_mart wm  
			LEFT JOIN dds.departments d ON d.short_name = wm.parent_dept 
			LEFT JOIN dds.employees e ON e.dept_id = d.dept_id 
			WHERE date between date '${startDate}' and date '${endDate}'
				AND e."name" LIKE '%${name}%'
			GROUP BY d.short_name, e."name"`
		)

		res.send(data.rows)
	}
	async getDepartments(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const name = req.params.name

		const data = await dbPG.query(` 
			SELECT 
				wm.short_name ,
				e."name" ,
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round (extract (epoch from date_trunc('second', avg (wm.working_time))) / extract (epoch from time '08:00') * 100 , 2) AS avg_working_time ,
				round (avg (wm.work_time_zone), 2) AS round
			FROM dds.work_mart wm 
			JOIN dds.departments d ON d.short_name = wm.parent_dept 
			JOIN dds.employees e ON e.dept_id = d.dept_id 
			WHERE date between date '${startDate}' and date '${endDate}'
				AND (e."name" = '${name}' )
			GROUP BY wm.short_name, e."name"
			ORDER BY 5 DESC;
		`)

		res.send(data.rows)
	}
	async getDepartment(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const department = req.params.department

		const data = await dbPG.query(` 
			SELECT 
				wm.short_name ,
				e."name" ,
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round (extract (epoch from date_trunc('second', avg (wm.working_time))) / extract (epoch from time '08:00') * 100 , 2) AS avg_working_time ,
				round (avg (wm.work_time_zone), 2) AS round
			FROM dds.work_mart wm 
			JOIN dds.departments d ON d.short_name = wm.parent_dept 
			JOIN dds.employees e ON e.dept_id = d.dept_id 
			WHERE date between date '${startDate}' and date '${endDate}'
				AND (wm."short_name" = '${department}' )
			GROUP BY wm.short_name, e."name"
			ORDER BY 5 DESC;
		`)

		res.send(data.rows)
	}
	async getDepartmentEmployees(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const department = req.params.department

		const data = await dbPG.query(`
			SELECT
				wm.short_name,
				wm."name",
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round (extract (epoch from date_trunc('second', avg (wm.working_time))) / extract (epoch from time '08:00') * 100 , 2) AS avg_working_time,
				round (avg (wm.work_time_zone), 2) AS round
			FROM dds.work_mart wm
			WHERE date between date '${startDate}' and date '${endDate}'
				AND wm.short_name = '${department}'
			GROUP BY wm.short_name, wm."name"
			ORDER BY 5 DESC;
		`)

		res.send(data.rows)
	}
	async getEmployee(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const name = req.params.name

		const data = await dbPG.query(`
			SELECT 
				wm."name" ,
				COUNT (late_time) AS late_cnt,
				COUNT (1) AS all_cnt,
				round (extract (epoch from date_trunc('second', avg (wm.working_time))) / extract (epoch from time '08:00') * 100 , 2) AS avg_working_time ,
				round (avg (wm.work_time_zone), 2) AS round
			FROM dds.work_mart wm 
			WHERE 
			"date" between date '${startDate}' and date '${endDate}'
				AND (wm."name"  like '${name}')
			GROUP BY wm."name";
		`)

		res.send(data.rows)
	}
	async getEmployeeCameraEvents(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const name = req.params.name

		const data = await dbPG.query(`
			select 
				distinct 
				to_char(cd."date", 'YYYY-MM-DD HH24:MI:SS'), 
				cn."name"
			from data_store.camera_data cd 
			join data_store.skud_employees se on se.id_dossiers = cd.id_dossier 
			join data_store.camera_names cn on cn.camera_id = cd.id_camera 
			where 1=1
				and se."name" like '%${name}%'
				and cd."date"::date between date '${startDate}' and date '${endDate}'
			order by 1 desc
			limit 200;
		`)

		res.send(data.rows)
	}
	async getEmployeeDoorEvents(req, res) {
		const startDate = req.params.startDate // yyyy-mm-dd
		const endDate = req.params.endDate // yyyy-mm-dd
		const name = req.params.name

		const data = await dbPG.query(`
			select 
				to_char(sd."date" ::timestamp, 'YYYY-MM-DD HH24:MI:SS') as "date",
				wz.driver_name as name,
				sd."eventType" as event_type
			from data_store.skud_data sd 
			left join data_store.work_zone wz on wz.id_driver = sd.ID_controller 
			left join data_store.skud_employees se on se.id_employee = sd."cardNumber" 
			where 1=1
				and name like '%${name}%'
				and sd."date"::date between date '${startDate}' and date '${endDate}'
				and (sd."eventType" = 'Вход' or sd."eventType" = 'Выход' or sd."eventType" = 'Вход по лицу' or sd."eventType" = 'Выход по лицу')
			order by 1 desc
			limit 100
			;
		`)

		res.send(data.rows)
	}
	async getPositions(req, res) {
		const floor = req.params.floor

		const data = await dbPG.query(
			`WITH last_skud_data AS (
				--определение последнего времени пользователя по скуду
				SELECT 
					sd."cardNumber"  AS card_n,
					MAX (sd."date") AS max_dt
				FROM data_store.skud_data sd 
				GROUP BY sd."cardNumber" 
				), 
				last_skud_event AS ( 
				--определение последнего события пользователя по скуду
				SELECT 
					e.id_dossier ,
					e."name" AS emp_name,
					sd2."eventType" ,
					lsd.max_dt 
				FROM data_store.skud_data sd2 
				JOIN last_skud_data lsd ON lsd.card_n = sd2."cardNumber" AND lsd.max_dt = sd2."date" 
				JOIN dds.employees e ON e.skud_id = sd2."cardNumber" 
				WHERE e.id_dossier  IS NOT NULL
					AND LOWER(sd2."eventType") LIKE '%вход%' --фильтр на то, что человек в здании
					AND (sd2."date") ::DATE = CURRENT_DATE
				), 
				last_va_data AS ( 
				--определение последнего времени пользователя по видео
				SELECT 
					cd.id_dossier,
					MAX (cd."date") AS max_dt
				FROM data_store.camera_data cd
				WHERE cd.id_dossier IS NOT NULL
					AND (cd."date") ::DATE = CURRENT_DATE
				GROUP BY cd.id_dossier
				), 
				basic_query AS 
				--основной запрос с агрегакцией камер и скуда
				(
				SELECT
					cn.area AS area,
					json_agg(DISTINCT max_skud.emp_name) AS employees,  
					COUNT (DISTINCT max_skud.emp_name) AS employee_cnt
				FROM  --убираем дубли из сырых данных
					(SELECT * ,
					ROW_NUMBER () OVER (partition BY id_dossier ORDER BY "date" DESC) AS row_num
					FROM data_store.camera_data cd 
					WHERE (cd."date") ::DATE = CURRENT_DATE ) cd
				JOIN last_va_data AS max_t ON max_t.max_dt = cd."date" AND max_t.id_dossier = cd.id_dossier --choosing last dossier event
				JOIN last_skud_event AS max_skud ON 
					max_skud.max_dt::DATE = cd."date"::DATE AND max_skud.id_dossier = cd.id_dossier --choosing last dossier event
				JOIN data_store.camera_names cn ON cn.camera_id = cd.id_camera 
				WHERE 
					area LIKE '${floor}%' --<-- вставить номер этажа
					AND row_num = 1
				GROUP BY 1
				)
				SELECT
					json_build_object('area', t.area::text, 'employees', t.employees, 'count', t.employee_cnt)
				FROM basic_query t;`
		)

		res.send(data.rows)
	}
	async getEmployeePosition(req, res) {
		const name = req.params.name

		const data = await dbPG.query(
			`WITH last_skud_event AS ( 
				--определение последнего события пользователя по скуду
				SELECT 
					sd2."eventType" ,
					sd2."cardNumber" 
				FROM data_store.skud_data sd2 
				JOIN ( --last skud event
					SELECT 
						sd."cardNumber"  AS card_n,
						MAX (sd."date") AS max_dt
					FROM data_store.skud_data sd 
					GROUP BY sd."cardNumber" 
				) lsd ON lsd.card_n = sd2."cardNumber" AND lsd.max_dt = sd2."date" 
				WHERE (sd2."date") ::DATE = CURRENT_DATE
				), 
				last_va_data AS ( 
				--определение последнего времени пользователя по видео
				SELECT 
					cd.id_dossier,
					MAX (cd."date") AS max_dt
				FROM data_store.camera_data cd
				WHERE cd.id_dossier IS NOT NULL
					AND (cd."date") ::DATE = CURRENT_DATE
				GROUP BY cd.id_dossier
				)
				SELECT
					CASE WHEN LOWER(max_skud."eventType") LIKE '%вход%' THEN cn."name" ELSE 'Вне зоны доступа' END AS locate
				FROM  --убираем дубли из сырых данных
					data_store.camera_data cd
				JOIN last_va_data AS max_t ON max_t.max_dt = cd."date" AND max_t.id_dossier = cd.id_dossier --choosing last dossier event
				JOIN dds.employees e ON e.id_dossier = cd.id_dossier 
				JOIN last_skud_event AS max_skud ON 
					max_skud."cardNumber"  = e.skud_id  --choosing last dossier event
				JOIN data_store.camera_names cn ON cn.camera_id = cd.id_camera 
				WHERE e.id_dossier IS NOT NULL
					AND LOWER(e."name") LIKE LOWER('%${name}%')`
		)

		res.send(data.rows)
	}
	async findNames(req, res) {
		const txt = req.params.txt
		console.log(txt)
		const data = await dbPG.query(
			`SELECT name
			FROM dds.employees
			WHERE lower(name) LIKE lower('${txt}%')`
		)
		res.send(data.rows)
	}

	// Bitrix
	async getAbsences(req, res) {
		const id = req.params.id
		await fetch(
			'https://bitrix.rt-techpriemka.ru/rest/307/6zhir45vw1merkyl/crm.item.list.json?entityTypeId=169'
		)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				console.log(resBody)
			})
			.catch(err => console.log(err))

		res.send('dasdfa')
	}
}

module.exports = new DataController()
