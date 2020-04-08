import React, { useState, useEffect, useContext, useReducer } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import { states } from './admin/states';
import { Formik } from 'formik';
import { UserContext } from '../context/UserContext';

import { map } from 'lodash';

export const LocationSelection = ({ handleClose, onSelectState }) => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const [locations, setLocations] = useState();
	const [cityOptions, setCityOptions] = useState();
	const [collectionId, setCollectionId] = useState();

	useEffect(() => {
		const getLocations = async () => {
			const resp = await firebaseDb.ref(`locations`).once('value');
			const locations = resp.val();
			setLocations(locations);
		};
		getLocations();
	}, []);

	// if (!user) {
	// 	return;
	// }

	if (!locations) {
		return 'Loading Locations...';
	}

	const selectState = (e, setFieldValue) => {
		const abr = e.target.value;
		setFieldValue('state', abr);
		let stateCities = map(locations[abr]);
		setCityOptions(stateCities);
		onSelectState(abr);
	};
	const stateAbrs = Object.entries(locations).map(([abr, city]) => abr);
	const stateOptions = stateAbrs.map((abr) => {
		return {
			state: states[abr],
			abr,
		};
	});

	return (
		<Formik
			initialValues={{ state: '', city: '' }}
			validate={(values) => {
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
				const location = {
					state: values.state,
					city: values.city,
					collectionId: `${values.state}_${values.city}`,
				};
				if (user) {
					await firebaseDb.ref(`users/${user.uid}/location`).set(location);
				}

				userDispatch({
					type: 'SET_LOCATION',
					location,
				});

				handleClose(location);
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
				setFieldValue,
				/* and other goodies */
			}) => (
				<Form onSubmit={handleSubmit}>
					<Form.Row className="align-items-center">
						<Form.Group as={Col}>
							<Form.Label>Select State</Form.Label>
							<div className="has-icon">
								<Form.Control
									as="select"
									onChange={(e, val) => {
										selectState(e, setFieldValue);
									}}
									name="state"
								>
									<option key="selectState" value="">
										Select State
									</option>
									{stateOptions.map((s) => {
										return (
											<option key={s.abr} value={s.abr}>
												{s.state}
											</option>
										);
									})}
								</Form.Control>
								<i className="fas fa-caret-down"></i>
							</div>
							{errors.state && touched.state && errors.state}
						</Form.Group>
						{values.state && (
							<Form.Group as={Col}>
								<Form.Label>Select City</Form.Label>
								<div className="has-icon">
									<Form.Control as="select" onChange={handleChange} name="city">
										<option key="selectCity" value="">
											Select City
										</option>
										{cityOptions.map((c) => {
											return (
												<option key={c.name} value={c.name}>
													{c.name}
												</option>
											);
										})}
									</Form.Control>
									<i className="fas fa-caret-down"></i>
								</div>
								{errors.city && touched.city && errors.city}
							</Form.Group>
						)}

						{values.state && (
							<Col>
								<Button type="submit" disabled={isSubmitting}>
									Set Location
								</Button>
							</Col>
						)}
					</Form.Row>
				</Form>
			)}
		</Formik>
	);
};
