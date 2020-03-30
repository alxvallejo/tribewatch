import React, { useContext } from 'react';

import { UserContext } from '../../context/UserContext';
import { AdminContext } from '../../context/AdminContext';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../services/firebase';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import { Formik } from 'formik';

export const NewStore = () => {
	const state = useContext(UserContext);
	const admin = useContext(AdminContext);

	const createStore = values => {};
	return (
		<div>
			<Formik
				initialValues={{ email: '', password: '' }}
				validate={values => {
					const errors = {};
					if (!values.name) {
						errors.email = 'Required';
					} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
						errors.email = 'Invalid email address';
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
