import React, { useContext, useReducer, useState, useEffect } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import { UserContext } from '../context/UserContext';
import { states } from './admin/states';

export const Profile = () => {
	const [{ user, profile }, userDispatch] = useContext(UserContext);

	const initFields = {
		...profile
	};

	return (
		<div>
			<h2>Profile</h2>
			<Formik
				initialValues={initFields}
				validate={values => {
					const errors = {};
					if (!values.name) {
						errors.name = 'Required';
					}
					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					const newProfile = {
						name: values.name,
						address: values.address,
						address2: values.address2 || null,
						city: values.city,
						state: values.state
					};
					await firebaseDb.ref(`users/${user.uid}/profile`).set(newProfile);

					userDispatch({
						type: 'SET_PROFILE',
						profile: newProfile
					});
				}}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting
					/* and other goodies */
				}) => (
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>Display Name</Form.Label>
							<Form.Control type="text" placeholder="Display Name" name="name" onChange={handleChange} />
							{errors.name && touched.name && errors.name}
						</Form.Group>
						<div>
							Your address is optional and will never be made public. It will only be revealed to drivers
							you accept to receive an order from.
						</div>
						<Form.Group>
							<Form.Label>Address</Form.Label>
							<Form.Control
								type="text"
								placeholder="1234 Main St"
								name="address"
								onChange={handleChange}
							/>
							{errors.address && touched.address && errors.address}
						</Form.Group>
						<Form.Group>
							<Form.Label>Address 2</Form.Label>
							<Form.Control type="text" placeholder="Apt. 5" name="address2" onChange={handleChange} />
							{errors.address2 && touched.address2 && errors.address2}
						</Form.Group>
						<Form.Row>
							<Form.Group>
								<Form.Label>City</Form.Label>
								<Form.Control type="text" name="city" onChange={handleChange} />
								{errors.city && touched.city && errors.city}
							</Form.Group>
							<Form.Group>
								<Form.Label>State</Form.Label>
								<Form.Control as="select" onChange={handleChange} name="state">
									<option key="selectState" value="">
										Select State
									</option>
									{Object.entries(states).map(([abr, name]) => {
										return (
											<option key={abr} value={abr}>
												{name}
											</option>
										);
									})}
								</Form.Control>
								{errors.state && touched.state && errors.state}
							</Form.Group>
						</Form.Row>

						<Button type="submit" disabled={isSubmitting}>
							Save Profile
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};
