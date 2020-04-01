import React, { useContext, useReducer } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { firebaseDb } from '../../../services/firebase';

export const CreateCity = () => {
	const [{ selectedState, cities }, adminDispatch] = useContext(AdminContext);
	// const adminCities = cities ? Object.entries(admin.cities).map(([city, val]) => val.name) : [];

	const createCity = async values => {
		const newCity = values.city;
		const collectionId = `${selectedState}_${newCity}`;
		firebaseDb.ref(`locations/${selectedState}/${newCity}`).set({
			name: newCity,
			state: selectedState,
			collectionId
		});
	};

	if (!selectedState) {
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
				if (cities.includes(values.city)) {
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
					<Form.Label>Add a city</Form.Label>
					<Form.Row>
						<Col>
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
						</Col>
					</Form.Row>
				</Form>
			)}
		</Formik>
	);
};
