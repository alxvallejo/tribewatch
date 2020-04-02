import React, { useState, useContext, useReducer } from 'react';

import { states } from '../states';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../../services/firebase';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { CreateCity } from './CreateCity';
import { NewStore } from '../stores/NewStore';
import { AdminContext } from '../../../context/AdminContext';

export const LocationSelect = () => {
	const [admin, adminDispatch] = useContext(AdminContext);
	const [cityOptions, setCityOptions] = useState();

	const selectState = async e => {
		const abr = e.target.value;
		const resp = await firebaseDb.ref(`locations/${abr}`).once('value');
		const cities = resp.val();
		adminDispatch({
			type: 'SET_CITIES',
			cities
		});
		adminDispatch({
			type: 'SET_SELECTED_STATE',
			selectedState: abr
		});
	};

	const selectCity = async e => {
		const cityName = e.target.value;
		const city = admin.cities[cityName];

		adminDispatch({
			type: 'SET_CITY',
			city
		});
	};

	return (
		<Card>
			<Card.Body>
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
									<option key="selectCity" value="">
										Select City
									</option>
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
			</Card.Body>
			<Card.Body>
				<CreateCity />
				<NewStore />
			</Card.Body>
		</Card>
	);
};
