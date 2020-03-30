import React, { useContext } from 'react';

import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LocationSelect } from './LocationSelect';

import { NewStore } from './NewStore';

export const AdminDash = () => {
	return (
		<Container>
			<h2>Admin Dashboard</h2>
			<LocationSelect />
			<NewStore />
		</Container>
	);
};
