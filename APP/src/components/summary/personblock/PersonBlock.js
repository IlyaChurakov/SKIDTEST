import React from 'react'
import Person from './person/Person'
import './personblock.scss'
import ReportLine from './reportline/ReportLine'

const PersonBlock = props => {
	return (
		<div className='person__wrapper'>
			<Person
				icon={props.icon}
				link={props.link}
				name={props.person.name}
				post={props.person.short_name}
			/>
			<ReportLine
				text='Количество опозданий'
				percent={{
					late_cnt: props.person.late_cnt,
					all_cnt: props.person.all_cnt,
				}}
				color={
					(+props.person.late_cnt / +props.person.all_cnt) * 100 > 20
						? '#D0598F'
						: '#65b970'
				}
				margin='0 0 0 68px'
			/>
			<ReportLine
				text='Среднее время нахождения в офисе'
				percent={props.person.avg_working_time}
				color={props.person.avg_working_time < 95 ? '#D0598F' : '#65b970'}
				margin='0 0 0 68px'
			/>
			<ReportLine
				text='Процент нахождения в рабочей зоне'
				percent={props.person.round}
				color={props.person.round < 70 ? '#D0598F' : '#65b970'}
				margin='0 0 0 68px'
			/>
		</div>
	)
}

export default PersonBlock
