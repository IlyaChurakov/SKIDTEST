import React, { useEffect, useState } from 'react'
import Loader from '../../loader/Loader'
import PersonBlock from '../personblock/PersonBlock'

const Employees = props => {
	const [persons, setPersons] = useState(null)

	const { startPeriod, endPeriod } = props.getDate(7)

	const getTopManagers = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeesStatistic/${props.startDate}/${props.endDate}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeesStatistic/${startPeriod}/${endPeriod}`

		console.log(url)

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setPersons(resBody)
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		props.setLeaderName('')
		props.setDep('')
		props.setName('')
	}, []) // responsible for the navigation link

	useEffect(() => {
		getTopManagers()
	}, [props.startDate, props.endDate]) // responsible for updating of the time periods

	return (
		<div className='sheet__info'>
			{persons ? (
				persons.length !== 0 ? (
					persons.map((person, key) => {
						return (
							<PersonBlock
								icon={true}
								link={`/employees/${person.name}`}
								key={key}
								person={person}
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
	)
}

export default Employees
