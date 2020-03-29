import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { sortBy, reverse } from 'lodash';
const moment = require('moment');
import { UserContext } from '../context/UserContext';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

// import { getLocation } from '../services/geolocate';

export const Dashboard = props => {
	const state = useContext(UserContext);

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
