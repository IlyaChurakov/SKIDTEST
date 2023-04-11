import React, { useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import logout from '../../icons/log-out-grey.svg'
import logo from '../../icons/main-logo.svg'
import settings from '../../icons/settings.svg'
import Department from './department/Department'
import Employee from './employee/Employee'
import Employees from './employees/Employees'
import Map from './map/Map'
import PersonInfo from './personinfo/PersonInfo'
import './summary.scss'

const Summary = () => {
	const startDate = useRef()
	const endDate = useRef()

	const [stdt, setStdt] = useState(
		startDate.current && startDate.current.value ? startDate.current.value : ''
	)
	const [endt, setEndt] = useState(
		endDate.current && endDate.current.value ? endDate.current.value : ''
	)
	const [name, setName] = useState(null)
	const [leaderName, setLeaderName] = useState(null)
	const [dep, setDep] = useState(null)

	const changeValues = () => {
		setStdt(
			startDate.current && startDate.current.value
				? startDate.current.value
				: ''
		)
		setEndt(
			endDate.current && endDate.current.value ? endDate.current.value : ''
		)
	}

	const getDate = period => {
		const day = 1000 * 60 * 60 * 24

		const now = new Date(),
			nowDay = now.getDate(),
			nowYear = now.getFullYear(),
			nowMonth = now.getMonth() + 1

		const past = new Date(now.getTime() - day * period),
			pastDay = past.getDate(),
			pastYear = past.getFullYear(),
			pastMonth = past.getMonth() + 1

		let startPeriod = `${pastYear}-${
			pastMonth >= 10 ? pastMonth : '0' + pastMonth
		}-${pastDay >= 10 ? pastDay : '0' + pastDay}`
		let endPeriod = `${nowYear}-${nowMonth >= 10 ? nowMonth : '0' + nowMonth}-${
			nowDay >= 10 ? nowDay : '0' + nowDay
		}`

		return { startPeriod, endPeriod }
	} // get period in days and return startPeriod and endPeriod in string

	const { startPeriod, endPeriod } = getDate(7)

	const [inputClass, setInputClass] = useState('')
	const [list, setList] = useState(null)

	const input = useRef()

	const clearValue = () => {
		input.current.value = ''
		changeInput()
		setInputClass('')
		// findPersonClick()
	}
	const setValue = e => {
		input.current.value = e.target.outerText
		changeInput()
		setInputClass('')
		// findPersonClick()
	}
	const changeInput = async () => {
		setInputClass('input__visible')

		if (input.current.value) {
			await fetch(
				`https://${process.env.REACT_APP_SERVER_URL}:8080/finder/${input.current.value}`
			)
				.then(res => {
					return res.json()
				})
				.then(resBody => {
					console.log(resBody)
					if (resBody.length) {
						setList(resBody)
					} else {
						setList(null)
					}
					// создать роут в апи с поиском по бд
					// обновлять список
				})
		}
	}
	// const findPersonClick = () => {
	// 	console.log('Find')
	// }
	// const findPerson = e => {
	// 	if (e.key == 'Enter') {
	// 		console.log('Find')
	// 	}
	// }

	return (
		<div className='summary'>
			<div className='summary__menu_left'>
				<Link to='/'>
					<ReactSVG src={logo} className='summary__menu_left-logo' />
				</Link>
				<div className='input__wrapper'>
					<input
						className='summary__menu_left-finder'
						placeholder='поиск...'
						onChange={changeInput}
						// onKeyDown={e => findPerson(e)}
						ref={input}
					/>
					<div className='input__clear' onClick={clearValue}>
						&#10006;
					</div>

					{list ? (
						<div className={`input__list ${inputClass}`}>
							{list.map((item, key) => {
								return (
									<Link
										to={`/employees/employee/${item.name}`}
										key={key}
										onClick={e => setValue(e)}
									>
										{item.name}
									</Link>
								)
							})}
						</div>
					) : null}
				</div>
				<div className='summary__menu_left-links'>
					<div className='map__buttons'>
						<Link to={'/employees/map/3'} className='map__buttons_item'>
							Карта 3 этажа
						</Link>
						<Link to={'/employees/map/4'} className='map__buttons_item'>
							Карта 4 этажа
						</Link>
						<Link to={'/employees/map/5'} className='map__buttons_item'>
							Карта 5 этажа
						</Link>
						<Link to={'/employees/map/6'} className='map__buttons_item'>
							Карта 6 этажа
						</Link>
					</div>
				</div>
			</div>
			<div className='summary__menu_right'>
				<div className='summary__menu_right-logout'>
					<ReactSVG src={logout} />
				</div>
				<div className='summary__menu_right-settings'>
					<ReactSVG src={settings} />
				</div>
			</div>
			<div className='summary__page'>
				<div className='sheet'>
					<div className='sheet__header'>
						<div className='sheet__header_period-routes'>
							<Link to={'/'}>Главная</Link>
							<Link to={'/employees'}> / Сотрудники</Link>
							{leaderName ? (
								<Link to={`/employees/${leaderName}`}> / {leaderName}</Link>
							) : null}
							{dep ? (
								<Link to={`/employees/departments/${dep}`}> / {dep}</Link>
							) : null}
							{name ? (
								<Link to={`/employees/employee/${name}`}> / {name}</Link>
							) : null}
						</div>
						<div className='sheet__header_period'>
							<div className='sheet__header_period-title'>Период:</div>
							<div className='sheet__header_period-from'>с</div>
							<input
								className='sheet__header_period-title'
								type='date'
								placeholder='Начало'
								ref={startDate}
								onInput={changeValues}
								value={stdt ? stdt : startPeriod}
							/>
							<div className='sheet__header_period-to'>по</div>
							<input
								className='sheet__header_period-title'
								type='date'
								placeholder='Конец'
								ref={endDate}
								onInput={changeValues}
								value={endt ? endt : endPeriod}
							/>
						</div>
					</div>
					<div className='sheet__header_back'></div>
					<Routes>
						<Route
							path='/'
							element={
								<Employees
									getDate={getDate}
									setLeaderName={setLeaderName}
									setDep={setDep}
									setName={setName}
									startDate={stdt}
									endDate={endt}
								/>
							}
						/>
						<Route
							path='/:name'
							element={
								<PersonInfo
									getDate={getDate}
									setLeaderName={setLeaderName}
									setDep={setDep}
									setName={setName}
									startDate={stdt}
									endDate={endt}
								/>
							}
						/>
						<Route
							path='/departments/:department'
							element={
								<Department
									getDate={getDate}
									setDep={setDep}
									setName={setName}
									startDate={stdt}
									endDate={endt}
								/>
							}
						/>
						<Route
							path='/employee/:name'
							element={
								<Employee
									getDate={getDate}
									setName={setName}
									startDate={stdt}
									endDate={endt}
								/>
							}
						/>
						<Route
							path='/map/:floor'
							element={
								<Map
									setDep={setDep}
									setName={setName}
									setLeaderName={setLeaderName}
								/>
							}
						/>
						<Route
							path='*'
							element={<div className='error'>Page not found</div>}
						/>
					</Routes>
					<div className='sheet__footer'></div>
				</div>
			</div>
		</div>
	)
}

export default Summary
