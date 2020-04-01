import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { sortBy, reverse } from 'lodash';
const moment = require('moment');
import { UserContext } from '../context/UserContext';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Profile } from './Profile';
import { LocationSelection } from './LocationSelection';

// import { getLocation } from '../services/geolocate';

export const Dashboard = props => {
	const [{ user, location, profile }, userDispatch] = useContext(UserContext);

	if (!user) {
		return;
	}

	if (!location) {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<LocationSelection />
				</Row>
			</Container>
		);
	}

	if (!profile) {
		return (
			<Container fluid>
				<Row>
					<h2>{`${location.city}, ${location.state}`}</h2>
				</Row>
				<Row className="justify-content-md-center">
					<Profile />
				</Row>
			</Container>
		);
	}

	return (
		<Container fluid>
			<Row>
				<Col>
					<h2>Stores</h2>
				</Col>
				<Col>
					<h2>Community</h2>
				</Col>
				<Col>
					<h2>Drivers</h2>
				</Col>
			</Row>
		</Container>
	);
};
