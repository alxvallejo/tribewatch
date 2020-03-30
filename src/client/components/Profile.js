import React, { useContext, useReducer, useState, useEffect } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseAuth, firebaseDb } from '../services/firebase';

const initFields = {
	name: '',
	state: '',
	city: '',
	address: '',
	ableToDrive: null
};

export const Profile = () => {
	useEffect(() => {
		const currentUser = firebaseAuth.currentUser;
		console.log('currentUser: ', currentUser);
		// const getProfile = async () => {
		// 	const resp = await firebaseDb.ref('locations').once('value');
		// 	console.log('resp: ', resp);
		// };
		// getLocations();
		const getLocations = async () => {
			const resp = await firebaseDb.ref('locations').once('value');
			console.log('resp: ', resp);
		};
		getLocations();
	}, []);

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
						<Form.Control size="lg" type="text" placeholder="Store Name" name="name" />
						{errors.email && touched.email && errors.email}
						<Button type="submit" disabled={isSubmitting}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};
