import React, { useContext, useReducer } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseDb } from '../../../services/firebase';

export const CreateCity = () => {
	const [admin, adminDispatch] = useContext(AdminContext);
	const stateAbr = admin.location ? admin.location.state : null;
	const adminCities = admin.cities ? Object.entries(admin.cities).map(([city, val]) => val.name) : [];

	const createCity = async values => {
		const city = values.city;
		const collectionId = `${stateAbr}_${city}`;
		firebaseDb.ref(`locations/${stateAbr}/${city}`).set({
			name: city,
			collectionId
		});
	};

	if (!stateAbr) {
		return 'Please select a state';
	}

	return (
		<Formik
			initialValues={{ city: '' }}
			validate={values => {
				const errors = {};
				if (!values.city) {
					errors.city = 'Required';
				}
				if (adminCities.includes(values.city)) {
					errors.city = 'Duplicate city';
				}
				return errors;
			}}
			onSubmit={async (values, { setSubmitting }) => {
				await createCity(values);
				setSubmitting(false);
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
					<Form.Control
						size="lg"
						type="text"
						placeholder="City"
						name="city"
						onChange={handleChange}
						onBlur={handleBlur}
						// value={values.name}
					/>
					{errors.city && touched.city && errors.city}
					<Button type="submit" disabled={isSubmitting}>
						Save
					</Button>
				</Form>
			)}
		</Formik>
	);
};
