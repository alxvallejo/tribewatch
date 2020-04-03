import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { sortBy, reverse } from 'lodash';
const moment = require('moment');
import { UserContext } from '../context/UserContext';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import { Preferences } from './Preferences';
import { Profile } from './Profile';
import { LocationSelection } from './LocationSelection';

import { Stores } from './stores';

// import { getLocation } from '../services/geolocate';

export const Dashboard = props => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	console.log('new location: ', location);
	const [showLocationModal, setLocationModal] = useState();

	if (!user) {
		return;
	}

	const handleClose = location => {
		setLocationModal(null);
	};

	if (!location) {
		return (
			<Container>
				<Row className="justify-content-md-center">
					<LocationSelection handleClose={handleClose} />
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
			<Container>
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
		<Container>
			<div className="location-header mb-3">
				<h2><span>Stores in </span>{`${location.city}, ${location.state}`}</h2>
				{preferences.canDrive && (
					<Badge variant="light" className="ml-3">
						<i className="fas fa-car" /> Driver
					</Badge>
				)}
				<a role="button" onClick={() => setLocationModal(true)}>
					<i className="mr-2 fas fa-map-marker-alt"></i>Change Location
				</a>
			</div>
			<div>
				<Stores />
			</div>
			{showLocationModal && (
				<Modal show={!!showLocationModal} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Change Location</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<LocationSelection handleClose={handleClose} />
					</Modal.Body>
				</Modal>
			)}
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
