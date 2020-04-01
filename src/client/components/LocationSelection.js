import React, { useState, useEffect, useContext, useReducer } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import { states } from './admin/states';
import { Formik } from 'formik';

import { map } from 'lodash';

export const LocationSelection = () => {
	const [locations, setLocations] = useState();
	const [cityOptions, setCityOptions] = useState();
	const [collectionId, setCollectionId] = useState();

	useEffect(() => {
		// const user = firebaseAuth.currentUser;
		console.log('firebaseAuth: ', firebaseAuth);
		// console.log('currentUser: ', currentUser);
		const getLocations = async () => {
			const resp = await firebaseDb.ref(`locations`).once('value');
			const locations = resp.val();
			console.log('locations: ', locations);
			setLocations(locations);
		};
		getLocations();
	}, []);

	if (!locations) {
		return 'Loading Locations...';
	}

	const selectState = (e, setFieldValue) => {
		const abr = e.target.value;
		setFieldValue('state', abr);
		let stateCities = map(locations[abr]);
		setCityOptions(stateCities);
	};

	const selectCollectionId = e => {
		const collectionId = e.target.value;
		setCollectionId(collectionId);
	};

	const stateAbrs = Object.entries(locations).map(([abr, city]) => abr);
	const stateOptions = stateAbrs.map(abr => {
		return {
			state: states[abr],
			abr
		};
	});

	return (
		<Row>
			<Formik
				initialValues={{ state: '', city: '' }}
				validate={values => {
					const errors = {};
					if (!values.state) {
						errors.state = 'Required';
					}
					if (!values.city) {
						errors.city = 'Required';
					}
					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					console.log('values: ', values);
					const user = firebaseAuth.currentUser;
					firebaseDb.ref(`users/${user.id}/collectionId`).set(values.city);
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					setFieldValue
					/* and other goodies */
				}) => (
					<Form onSubmit={handleSubmit}>
						<Form.Group as={Col}>
							<Form.Label>Select State</Form.Label>
							<Form.Control
								as="select"
								onChange={(e, val) => {
									console.log('val: ', val);
									selectState(e, setFieldValue);
								}}
								name="state"
							>
								<option key="selectState" value="">
									Select State
								</option>
								{stateOptions.map(s => {
									return (
										<option key={s.abr} value={s.abr}>
											{s.state}
										</option>
									);
								})}
							</Form.Control>
							{errors.state && touched.state && errors.state}
						</Form.Group>
						{values.state && (
							<Form.Group as={Col}>
								<Form.Label>Select City</Form.Label>
								<Form.Control as="select" onChange={handleChange} name="city">
									<option key="selectCity" value="">
										Select City
									</option>
									{cityOptions.map(c => {
										return (
											<option key={c.name} value={c.collectionId}>
												{c.name}
											</option>
										);
									})}
								</Form.Control>
								{errors.city && touched.city && errors.city}
								<Button type="submit" disabled={isSubmitting}>
									Set Location
								</Button>
							</Form.Group>
						)}
					</Form>
				)}
			</Formik>
		</Row>
	);
};
