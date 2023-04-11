import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import map3 from '../../../icons/map3.svg'
import map4 from '../../../icons/map4.svg'
import map5 from '../../../icons/map5.svg'
import map6 from '../../../icons/map6.svg'
import './map.scss'

const Map = props => {
	const [peopleNum, setPeopleNum] = useState([])

	const { floor } = useParams()

	const getPositions = async floor => {
		const url = `https://${process.env.REACT_APP_SERVER_URL}:8080/positions/${floor}`
		console.log(url)
		await fetch(url)
			.then(res => {
				return res.json()
			})
			.then(resBody => {
				setPeopleNum(resBody)
			})
			.catch(err => console.log(err))
	}

	const [st, setSt] = useState(0)

	useEffect(() => {
		getPositions(floor)
		console.log(peopleNum)
	}, [floor, st])

	useEffect(() => {
		props.setDep('')
		props.setLeaderName('')
		props.setName('')
	}, [])

	setTimeout(() => {
		setSt(st + 1)
	}, 3000)

	return (
		<div className='maplayout'>
			<div className='wrapper'>
				<ReactSVG
					src={
						floor == 6
							? map6
							: floor == 5
							? map5
							: floor == 4
							? map4
							: floor == 3
							? map3
							: null
					}
					className='map'
					beforeInjection={svg => {
						svg.setAttribute('style', 'width: 1200px')
					}}
				/>
				{peopleNum ? (
					peopleNum.length ? (
						peopleNum.map((item, key) => {
							return (
								<div
									key={key}
									className={`people people__${
										item.json_build_object ? item.json_build_object.area : null
									}`}
								>
									<div className='people__list'>
										{item.json_build_object
											? item.json_build_object.employees.map((emp, key) => {
													return (
														<div key={key} className='people__list_item'>
															{`${key + 1}) ${emp}`}
														</div>
													)
											  })
											: null}
									</div>
									<div className='people__circle'>
										{item.json_build_object
											? item.json_build_object.count
											: null}
									</div>
								</div>
							)
						})
					) : (
						<div className='loading'>Loading...</div>
					)
				) : null}
			</div>
		</div>
	)
}

export default Map
