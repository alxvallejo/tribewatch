import React, { useState, useContext, useReducer } from 'react';

import { states } from '../states';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../../services/firebase';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { CreateCity } from './CreateCity';
import { AdminContext } from '../../../context/AdminContext';

export const LocationSelect = () => {
	const [admin, adminDispatch] = useContext(AdminContext);
	const [cityOptions, setCityOptions] = useState();

	const selectState = async e => {
		const abr = e.target.value;
		adminDispatch({
			type: 'SET_LOCATION',
			location: { state: abr, city: null }
		});
		const stateCitiesResponse = await firebaseDb.ref(`locations/${abr}`).once('value');
		const stateCities = stateCitiesResponse.val();
		adminDispatch({
			type: 'SET_CITIES',
			cities: stateCities
		});
	};

	const selectCity = async e => {
		const city = e.target.value;
		adminDispatch({
			type: 'SET_CITY',
			city
		});
	};

	return (
		<Container fluid>
			<Row className="d-flex justify-content-between align-items-start">
				<Form>
					<Form.Row>
						<Form.Group as={Col} controlId="locationSelect.state">
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
							<Form.Group as={Col} controlId="locationSelect.city">
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
					</Form.Row>
				</Form>
			</Row>
			<Row>
				<Col></Col>
				<Col>
					<CreateCity />
				</Col>
			</Row>
		</Container>
	);
};
