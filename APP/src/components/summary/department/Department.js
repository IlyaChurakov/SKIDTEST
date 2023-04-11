import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../loader/Loader'
import PersonBlock from '../personblock/PersonBlock'
import './department.scss'

const Department = props => {
	const { department } = useParams()
	const [employees, setEmployees] = useState(null)
	const [dep, setDep] = useState(null)

	const { startPeriod, endPeriod } = props.getDate(7)

	const getDepartment = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/department/${props.startDate}/${props.endDate}/${department}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/department/${startPeriod}/${endPeriod}/${department}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setDep(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}

	const getDepartmentEmployees = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/departmentEmployees/${props.startDate}/${props.endDate}/${department}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/departmentEmployees/${startPeriod}/${endPeriod}/${department}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setEmployees(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		props.setDep(department)
		props.setName('')
	}, []) // responsible for the navigation link

	useEffect(() => {
		getDepartment()
		getDepartmentEmployees()
	}, [props.startDate, props.endDate]) // responsible for updating of the time periods

	return (
		<div className='department'>
			<div className='department__title'>
				{dep && employees ? (
					dep.length !== 0 && employees.length !== 0 ? (
						dep.map((item, key) => {
							return (
								<PersonBlock
									key={key}
									icon={false}
									person={{
										late_cnt: item.late_cnt,
										all_cnt: item.all_cnt,
										name: item.short_name,
										avg_working_time: item.avg_working_time,
										round: item.round,
									}}
								/>
							)
						})
					) : (
						<div className='error'>За этот период данных нет</div>
					)
				) : (
					<Loader />
				)}
			</div>

			<div className='department__employees'>
				{dep && employees
					? employees.length
						? employees.map((item, key) => {
								return (
									<div className='department__employees_employee' key={key}>
										<PersonBlock
											icon={true}
											person={item}
											link={`/employees/employee/${item.name}`}
										/>
									</div>
								)
						  })
						: null
					: null}
			</div>
		</div>
	)
}

export default Department
