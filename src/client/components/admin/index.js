import React, { useContext, useEffect } from 'react';

import { UserContext } from '../../context/UserContext';
import { AdminContext } from '../../context/AdminContext';
import { Container, Row, Col, Button, Card, Tab, Nav } from 'react-bootstrap';
import { LocationSelect } from './locations/LocationSelect';
import { Users } from './users';
import { firebaseDb } from '../../services/firebase';

import { Stores } from './stores';

export const AdminDash = props => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [{ cities, selectedState, city }, adminDispatch] = useContext(AdminContext);
	console.log('city at admin index: ', city);

	const setAdmin = () => {
		firebaseDb.ref(`admins`).push({
			uid: user.uid,
			name: user.displayName
		});
	};

	return (
		<Tab.Container id="left-tabs-example" defaultActiveKey="first">
			<h3 className="mb-3">Admin Dashboard</h3>
			<Row>
				<Col sm={3}>
					<Nav variant="pills" className="flex-column">
						<Nav.Item>
							<Nav.Link eventKey="first">Locations</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="second">Users</Nav.Link>
						</Nav.Item>
					</Nav>
				</Col>
				<Col sm={9}>
					<Tab.Content>
						<Tab.Pane eventKey="first">
							<LocationSelect />
							<Stores />
						</Tab.Pane>
						<Tab.Pane eventKey="second">
							<Users />
						</Tab.Pane>
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>
	);
};
