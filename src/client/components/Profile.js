import React, { useContext, useReducer, useState, useEffect } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseAuth, firebaseDb } from '../services/firebase';

export const Profile = () => {
	const [profile, setProfile] = useState();

	useEffect(() => {
		// const user = firebaseAuth.currentUser;
		console.log('firebaseAuth: ', firebaseAuth);
		// console.log('currentUser: ', currentUser);
		const getProfile = async () => {
			const resp = await firebaseDb.ref(`users/${user.uid}/profile`).once('value');
			const profile = resp.val();
			console.log('profile: ', profile);
			if (profile) {
				setProfile(profile);
			}
		};
		// getProfile();
		const getLocations = async () => {
			const resp = await firebaseDb.ref('locations').once('value');
			console.log('resp: ', resp);
		};
		getLocations();
	}, []);

	const initFields = {
		name: '',
		state: '',
		city: '',
		address: '',
		ableToDrive: null
	};

	const createProfile = values => {};
	return (
		<div>
			<Formik
				initialValues={initFields}
				validate={values => {
					const errors = {};
					if (!values.name) {
						errors.name = 'Required';
					}
					return errors;
				}}
				onSubmit={(values, { setSubmitting }) => {
					// setTimeout(() => {
					// 	alert(JSON.stringify(values, null, 2));
					// 	setSubmitting(false);
					// }, 400);
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
							<Form.Control size="lg" type="text" placeholder="Display Name" name="name" />
							{errors.name && touched.name && errors.name}
						</Form.Group>
						<Form.Group>
							<Form.Label>Display Name</Form.Label>
							<Form.Control size="lg" type="text" placeholder="Display Name" name="name" />
							{errors.name && touched.name && errors.name}
						</Form.Group>
						<Form.Group>
							<Form.Label>Display Name</Form.Label>
							<Form.Control size="lg" type="text" placeholder="Display Name" name="name" />
							{errors.name && touched.name && errors.name}
						</Form.Group>

						<Button type="submit" disabled={isSubmitting}>
							Save
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};
