import React, { useState, useContext, useReducer } from 'react';

import { states } from './states';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../services/firebase';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { CreateCity } from './locations/CreateCity';
import { AdminContext } from '../../context/AdminContext';
import { AdminReducer, initialAdmin } from '../../reducers/AdminReducer';

export const LocationSelect = () => {
	const [admin, adminDispatch] = useContext(AdminContext);
	// const [admin, adminDispatch] = useReducer(AdminReducer, initialAdmin);
	console.log('admin: ', admin);

	const [geoState, setGeoState] = useState();
	const [geoCity, setGeoCity] = useState();
	const [cityOptions, setCityOptions] = useState();
	console.log('cityOptions: ', cityOptions);

	const stateOptions = Object.entries(states);

	const selectState = async e => {
		const abr = e.target.value;
		console.log('abr: ', abr);
		// admin.setLocation({ state: abr, city: null });
		adminDispatch({
			type: 'SET_LOCATION',
			location: { state: abr, city: null }
		});
		const stateCitiesResponse = await firebaseDb.ref(`locations/${abr}`).once('value');
		const stateCities = stateCitiesResponse.val();
		console.log('stateCities: ', stateCities);
		// setCityOptions(stateCities);
		// admin.setCities(stateCities);
		adminDispatch({
			type: 'SET_CITIES',
			cities: stateCities
		});
	};

	const selectCity = async e => {
		const city = e.target.value;
		console.log('city: ', city);
		console.log('location', location);

		// admin.setLocation({ state: abr, city: null });
	};

	const citySelect = () => {
		if (!cityOptions) {
			return 'Select a State';
		}
	};

	return (
		<Container fluid>
			<Row className="d-flex justify-content-between align-items-start">
				<Col>
					<Form inline>
						<Form.Group controlId="locationSelect.state">
							<Form.Label>Select State</Form.Label>
							<Form.Control as="select" onChange={abr => selectState(abr)}>
								{Object.entries(states).map(([abr, state]) => {
									return (
										<option key={abr} value={abr}>
											{state}
										</option>
									);
								})}
							</Form.Control>
						</Form.Group>
						{admin.cities && (
							<Form.Group controlId="locationSelect.city">
								<Form.Label>Select City</Form.Label>
								<Form.Control as="select" onChange={city => selectCity(city)}>
									{Object.entries(admin.cities).map(([city, val]) => {
										return (
											<option key={city} value={city}>
												{city}
											</option>
										);
									})}
								</Form.Control>
							</Form.Group>
						)}
					</Form>
				</Col>
			</Row>
			<Row>
				<Col>
					<CreateCity />
				</Col>
			</Row>
		</Container>
	);
};
