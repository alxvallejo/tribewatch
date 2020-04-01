import React, { useContext, useReducer, useState, useEffect } from 'react';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import { UserContext } from '../context/UserContext';
import { states } from './admin/states';

export const Preferences = () => {
	const [{ user, preferences }, userDispatch] = useContext(UserContext);

	useEffect(() => {}, []);

	const initFields = {
		...preferences
	};

	return (
		<div>
			<h2>Preferences</h2>
			<Formik
				initialValues={initFields}
				validate={values => {
					const errors = {};
					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					const newPreferences = {
						canDrive: !!values.canDrive,
						atRisk: !!values.atRisk
						// haveGoods: values.haveGoods
					};
					await firebaseDb.ref(`users/${user.uid}/preferences`).set(newPreferences);

					userDispatch({
						type: 'SET_PREFERENCES',
						preferences: newPreferences
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
						<Form.Check
							custom
							type="checkbox"
							label="I would like to make deliveries."
							name="canDrive"
							id="canDrive"
							onChange={handleChange}
						/>
						{errors.canDrive && touched.canDrive && errors.canDrive}
						<Form.Check
							custom
							type="checkbox"
							label="I am a high risk demographic (and will be given higher visibility)."
							name="atRisk"
							id="atRisk"
							onChange={handleChange}
						/>
						{errors.atRisk && touched.atRisk && errors.atRisk}

						<Button type="submit" disabled={isSubmitting}>
							Continue
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};
