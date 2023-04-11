import React from 'react'
import { ReactSVG } from 'react-svg'
import exit from '../../icons/log-out.svg'
import mainLogo from '../../icons/main-logo.svg'
import Block from './Block'
import './main.scss'

const Main = () => {
	return (
		<div className='layout'>
			<div className='wrapper'>
				<div className='blocks'>
					<ReactSVG src={mainLogo} className='mainLogo' />
					<div className='exit'>
						<ReactSVG src={exit} />
						<div className='exit__text'>ВЫХОД</div>
					</div>
					<Block
						link='/employees'
						filled='filled'
						title={'Сводка'}
						subtitle={'Сводка по сотрудникам и депарматентам'}
						descr={'Метрика по сотрудникам и подразделениям'}
					/>
					<div className='blocks__block'>
						<div className='blocks__block_text'>To be continued...</div>
					</div>
					<div className='blocks__block'>
						<div className='blocks__block_text'>To be continued...</div>
					</div>
					<Block
						link='/employees/map/3'
						filled='filled'
						title='Карта'
						subtitle='3 этаж'
						descr='Местоположение сотрудников'
					/>
					<Block
						link='/employees/map/4'
						filled='filled'
						title='Карта'
						subtitle='4 этаж'
						descr='Местоположение сотрудников'
					/>
					<Block
						link='/employees/map/5'
						filled='filled'
						title='Карта'
						subtitle='5 этаж'
						descr='Местоположение сотрудников'
					/>
					<Block
						link='/employees/map/6'
						filled='filled'
						title='Карта'
						subtitle='6 этаж'
						descr='Местоположение сотрудников'
					/>
				</div>
			</div>
		</div>
	)
}

export default Main
