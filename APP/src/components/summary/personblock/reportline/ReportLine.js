import React from 'react'
import './reportLine.scss'

const ReportLine = props => {
	return (
		<div
			className='reportLine'
			style={{
				margin: props.margin,
			}}
		>
			<div className='reportLine__text'>% {props.text}</div>
			<div className='reportLine__line'>
				<div
					className='reportLine__line_load'
					style={{
						width:
							typeof props.percent === 'object'
								? props.percent &&
								  props.percent.late_cnt &&
								  props.percent.all_cnt
									? (props.percent.late_cnt / props.percent.all_cnt) * 100 + '%'
									: 0
								: props.percent + '%',
						backgroundColor: props.color,
					}}
				></div>
			</div>
			<div className='reportLine__percent'>
				{typeof props.percent === 'object'
					? props.percent && props.percent.late_cnt && props.percent.all_cnt
						? `${props.percent.late_cnt} / ${props.percent.all_cnt}`
						: 0
					: props.percent.split('.')[0] + '%'}
			</div>
		</div>
	)
}

export default ReportLine
