import React from 'react';
import { Card as CD, CardTitle, CardText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import style from './style.scss'

const Card = ({title = '', description = '', btnLabel = '', children = null, linkTo ,className}) => (
	<CD body className={[style.Card,className].join(' ')}>
		<CardTitle tag="h5">{title}</CardTitle>
			{children ? children :
			<React.Fragment>
				<CardText>
					{description}				
				</CardText>
				<Button onClick={() => window.location.href = linkTo}>{btnLabel}</Button>
			</React.Fragment>
			}
	</CD>
);

export default Card