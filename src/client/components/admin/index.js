import React, { useContext } from 'react';

import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LocationSelect } from './locations/LocationSelect';

import { Stores } from './stores';

export const AdminDash = () => {
	return (
		<Container>
			<h2>Admin Dashboard</h2>
			<LocationSelect />
			<Stores />
		</Container>
	);
};
