import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { LocationSelection } from './LocationSelection';
import { SuggestCity } from './SuggestCity';
import { Stores } from './stores';

export const Dashboard = (props) => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const [showLocationModal, setLocationModal] = useState();
	const [selectedState, setSelectedState] = useState();
	const [showLogin, setShowLogin] = useState();

	const handleLocationClose = (location) => {
		setLocationModal(null);
	};

	if (!location) {
		return (
			<Container>
				<div className="text-center mb-4">
					<div className="icons h2 mb-4">
						<i className="fas fa-pump-soap mr-4 pr-2"></i>
						<i className="fas fa-toilet-paper"></i>
						<i className="fas fa-thermometer-half ml-4 pl-2"></i>
					</div>
					<h2 style={{ lineHeight: '1.5' }}>
						Real-time reporting
						<br />
						of <em>essential items</em>
						<br />
						in your community.
					</h2>
					<div></div>
				</div>
				<Row>
					<Col className="d-flex flex-column align-items-center">
						<div>
							<LocationSelection
								handleClose={handleLocationClose}
								onSelectState={(state) => setSelectedState(state)}
							/>
						</div>
						<div className="mb-4">
							<a onClick={() => userDispatch({ type: 'SHOW_LOGIN', showLogin: true })}>
								Already have a login?
							</a>
						</div>
						{selectedState && (
							<div>
								<SuggestCity state={selectedState} />
							</div>
						)}
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<Container>
			<div className="location-header mb-3">
				<h2>
					<span>Stores in </span>
					{`${location.city}, ${location.state}`}
				</h2>
				{/* {preferences.canDrive && (
					<Badge variant="light" className="ml-3">
						<i className="fas fa-car" /> Driver
					</Badge>
				)} */}
			</div>
			<div>
				<Stores />
			</div>
		</Container>
	);
};
