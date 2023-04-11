import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../loader/Loader'
import PersonBlock from '../personblock/PersonBlock'
import ReportLine from '../personblock/reportline/ReportLine'
import './personinfo.scss'

const PersonInfo = props => {
	const { name } = useParams()
	const [person, setPerson] = useState(null)
	const [departments, setDepartments] = useState(null)

	const { startPeriod, endPeriod } = props.getDate(7)

	const getPerson = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/personStatistic/${props.startDate}/${props.endDate}/${name}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/personStatistic/${startPeriod}/${endPeriod}/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setPerson(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}

	const getDepartments = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/departments/${props.startDate}/${props.endDate}/${name}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/departments/${startPeriod}/${endPeriod}/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setDepartments(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		props.setLeaderName(name)
		props.setDep('')
		props.setName('')
	}, []) // responsible for the navigation link

	useEffect(() => {
		getPerson()
		getDepartments()
	}, [props.startDate, props.endDate]) // responsible for updating of the time periods

	return (
		<div className='sheet__info_person'>
			{person && departments ? (
				person.length !== 0 && departments.length !== 0 ? (
					person.map((item, key) => {
						return (
							<PersonBlock
								icon={true}
								key={key}
								person={item}
								actionHandler={props.sendName}
							/>
						)
					})
				) : (
					<div className='error'>За этот период данных нет</div>
				)
			) : (
				<Loader />
			)}

			<div className='departments'>
				{person && departments ? (
					departments.length !== 0 && person.length !== 0 ? (
						departments.map((item, key) => {
							return (
								<div key={key} className='departments__item'>
									<div className='departments__item_dep'>
										<Link
											to={`/employees/departments/${item.short_name}`}
											className='departments__item_dep-text'
										>
											{item.short_name}
										</Link>
										<ReportLine
											text={'Количество опозданий'}
											percent={{
												all_cnt: item.all_cnt,
												late_cnt: item.late_cnt,
											}}
											color={
												(+item.late_cnt / +item.all_cnt) * 100 > 20
													? '#D0598F'
													: '#65b970'
											}
										/>
										<ReportLine
											text={'Среднее время нахождения в офисе'}
											percent={item.avg_working_time}
											color={item.avg_working_time < 70 ? '#D0598F' : '#65b970'}
										/>
										<ReportLine
											text={'Процент нахождения в рабочей зоне'}
											percent={item.round}
											color={item.round < 70 ? '#D0598F' : '#65b970'}
										/>
									</div>
								</div>
							)
						})
					) : null
				) : (
					<Loader />
				)}
			</div>
		</div>
	)
}

export default PersonInfo
