import React from 'react'
import { Link } from 'react-router-dom'

const Block = props => {
	return (
		<Link to={props.link} className='blocks__block'>
			<div className={'blocks__block_text' + props.filled ? props.filled : ''}>
				<div className='blocks__block_title'>{props.title}</div>
				<div className='blocks__block_subtitle'>{props.subtitle}</div>
				<div className='blocks__block_descr'>{props.descr}</div>
			</div>
		</Link>
	)
}

export default Block
