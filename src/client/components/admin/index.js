import React, { useContext, useEffect } from 'react';

import { UserContext } from '../../context/UserContext';
import { AdminContext } from '../../context/AdminContext';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { LocationSelect } from './locations/LocationSelect';

import { Stores } from './stores';

export const AdminDash = props => {
	const [{ cities, selectedState, city }, adminDispatch] = useContext(AdminContext);
	console.log('city at admin index: ', city);

	return (
		<Container>
			<h2 className="mb-3">Admin Dashboard</h2>
			<Card>
				<LocationSelect />
			</Card>

			<Row className="justify-content-md-center">
				<Stores />
			</Row>
		</Container>
	);
};
