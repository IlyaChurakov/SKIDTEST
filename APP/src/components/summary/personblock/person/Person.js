import React from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import icon from '../../../../icons/person-icon.svg'
import './person.scss'

const Person = props => {
	return (
		<div className='person'>
			{props.icon ? <ReactSVG src={icon} className='person__icon' /> : null}
			<Link to={props.link} className='person__name'>
				{props.name}
			</Link>
			<div className='person__post'>{props.post}</div>
		</div>
	)
}

export default Person
