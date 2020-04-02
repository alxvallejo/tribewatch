import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { sortBy, reverse } from 'lodash';
const moment = require('moment');
import { UserContext } from '../context/UserContext';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Preferences } from './Preferences';
import { Profile } from './Profile';
import { LocationSelection } from './LocationSelection';

import { Stores } from './stores';

// import { getLocation } from '../services/geolocate';

export const Dashboard = props => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	console.log('location: ', location);

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

	if (!preferences) {
		return (
			<Container>
				<Row className="align-items-center">
					<h2>{`${location.city}, ${location.state}`}</h2>
				</Row>
				<Row className="justify-content-md-center">
					<Preferences />
				</Row>
			</Container>
		);
	}

	if (!profile) {
		return (
			<Container fluid>
				<Row className="align-items-center">
					<h2>{`${location.city}, ${location.state}`}</h2>
					{preferences.canDrive && (
						<Badge variant="light" className="ml-3">
							<i className="fas fa-car" /> Driver
						</Badge>
					)}
				</Row>
				<Row className="justify-content-md-center">
					<Profile />
				</Row>
			</Container>
		);
	}

	return (
		<Container fluid>
			<Row className="align-items-center">
				<h2>{`${location.city}, ${location.state}`}</h2>
				{preferences.canDrive && (
					<Badge variant="light" className="ml-3">
						<i className="fas fa-car" /> Driver
					</Badge>
				)}
			</Row>
			<Row>
				<Stores />
			</Row>
			{/* <Row>
				<Col>
					<h2>Stores</h2>
				</Col>
				<Col>
					<h2>Community</h2>
				</Col>
				<Col>
					<h2>Drivers</h2>
				</Col>
			</Row> */}
		</Container>
	);
};
