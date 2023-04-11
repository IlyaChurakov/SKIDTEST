import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../../loader/Loader'
import PersonBlock from '../personblock/PersonBlock'
import './employee.scss'

const Employee = props => {
	const { name } = useParams()
	const [cameraEvents, setCameraEvents] = useState(null)
	const [doorEvents, setDoorEvents] = useState(null)
	const [employee, setEmployee] = useState(null)
	const [position, setPosition] = useState(null)

	const { startPeriod, endPeriod } = props.getDate(7)

	const getEmployee = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employee/${props.startDate}/${props.endDate}/${name}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employee/${startPeriod}/${endPeriod}/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setEmployee(resBody)
			})
			.catch(err => console.log(err))
	}
	const getEmployeeCameraEvents = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeeCameraEvents/${props.startDate}/${props.endDate}/${name}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeeCameraEvents/${startPeriod}/${endPeriod}/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setCameraEvents(resBody)
			})
			.catch(err => console.log(err))
	}
	const getEmployeeDoorEvents = async () => {
		const url =
			props.startDate && props.endDate
				? `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeeDoorEvents/${props.startDate}/${props.endDate}/${name}`
				: `https://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/employeeDoorEvents/${startPeriod}/${endPeriod}/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setDoorEvents(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}
	const getPosition = async () => {
		const url = `https://${process.env.REACT_APP_SERVER_URL}:8080/position/${name}`

		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setPosition(resBody)
				console.log(resBody)
			})
			.catch(err => console.log(err))
	}

	useEffect(() => {
		props.setName(name)
		getPosition()
	}, [employee]) // responsible for the navigation link

	useEffect(() => {
		getEmployee()
		getEmployeeCameraEvents()
		getEmployeeDoorEvents()
	}, [props.startDate, props.endDate, name]) // responsible for updating of the time periods

	return (
		<div className='employee'>
			{employee ? (
				employee.length !== 0 ? (
					employee.map((item, key) => {
						return (
							<PersonBlock
								key={key}
								icon={true}
								person={{
									late_cnt: item.late_cnt,
									all_cnt: item.all_cnt,
									name: item.name,
									avg_working_time: item.avg_working_time,
									round: item.round,
								}}
							/>
						)
					})
				) : (
					<div className='error'>Данных по сотруднику нет</div>
				)
			) : (
				<Loader />
			)}
			<div className='employee__wrapper'>
				<div className='employee__wrapper_titles'>
					<div className='employee__wrapper_titles-title'>Камеры</div>
					<div className='employee__wrapper_titles-position'>
						{position ? (position.length ? position[0].locate : null) : null}
					</div>
					<div className='employee__wrapper_titles-title'>СКУД</div>
				</div>
				<div className='employee__camera'>
					{employee && cameraEvents && doorEvents ? (
						cameraEvents.length && employee.length && doorEvents.length ? (
							cameraEvents.map((item, key) => {
								return (
									<div key={key} className='employee__camera_event'>
										<div className='employee__camera_event-name'>
											{item.name}
										</div>
										<div className='employee__camera_event-date'>
											{item.to_char.split(' ')[0]}
										</div>
										<div className='employee__camera_event-time'>
											{item.to_char.split(' ')[1]}
										</div>
									</div>
								)
							})
						) : (
							<div className='error'>Событий по камерам нет</div>
						)
					) : (
						<Loader />
					)}
				</div>
				<div className='employee__door'>
					{employee && cameraEvents && doorEvents ? (
						doorEvents.length && cameraEvents.length && employee.length ? (
							doorEvents.map((item, key) => {
								return (
									<div key={key} className='employee__camera_event'>
										<div className='employee__door_event-type'>
											{item.event_type}
										</div>
										<div className='employee__door_event-name'>{item.name}</div>
										<div className='employee__door_event-date'>
											{item.date.split(' ')[0]}
										</div>
										<div className='employee__door_event-time'>
											{item.date.split(' ')[1]}
										</div>
									</div>
								)
							})
						) : (
							<div className='error'>Событий по СКУД нет</div>
						)
					) : (
						<Loader />
					)}
				</div>
			</div>
		</div>
	)
}

export default Employee
