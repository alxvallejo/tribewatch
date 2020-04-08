import React, { useState, useContext } from 'react';

import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import { UserContext } from '../context/UserContext';
import { Formik } from 'formik';
const moment = require('moment');

export const SuggestCity = ({ state }) => {
	const [{ user, profile }, userDispatch] = useContext(UserContext);
	const [submitted, setSubmitted] = useState();

	if (submitted) {
		return (
			<Card>
				<Card.Body>
					<h3 className="text-success">Thank you!</h3>
					<b>We will add your city shortly. Check back soon.</b>
				</Card.Body>
			</Card>
		);
	}

	const CitySuggestion = () => {
		return (
			<Formik
				initialValues={{ city: '' }}
				validate={(values) => {
					const errors = {};
					if (!values.city) {
						errors.city = 'Required';
					}
					return errors;
				}}
				onSubmit={async (values, { setSubmitting }) => {
					const unix = moment().unix();
					const newSuggestion = {
						user: user ? user.uid : null,
						userEmail: user ? user.email : null,
						userName: user ? user.displayName : null,
						time: unix,
						state: state,
						city: values.city,
					};
					await firebaseDb.ref(`suggestions/cities`).push(newSuggestion);
					setSubmitted(true);
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
					<Form onSubmit={handleSubmit}>
						<Form.Row className="align-items-center">
							<Col>
								<Form.Control
									type="text"
									placeholder="Enter your city"
									name="city"
									onChange={handleChange}
								/>
								{errors.city && touched.city && errors.city}
							</Col>
							<Col>
								<Button type="submit" disabled={isSubmitting}>
									Request my city
								</Button>
							</Col>
						</Form.Row>
					</Form>
				)}
			</Formik>
		);
	};

	return (
		<Card>
			<Card.Header>Not Listed?</Card.Header>
			<Card.Body>
				<Card.Title>Which city are you looking for?</Card.Title>
				<p>We're rolling out cities one by one. We can have your city up in no time!</p>
				<CitySuggestion />
			</Card.Body>
		</Card>
	);
};
