import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Button, ToggleButton, ToggleButtonGroup, Modal, Form, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useFormik } from 'formik';
import { firebaseDb } from '../../services/firebase';
const moment = require('moment');

export const DriverForm = () => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const [profile, setProfile] = useState();
	const getMyDriverProfile = async () => {
		const resp = await firebaseDb.ref(`driverProfiles/${location.collectionId}/${user.uid}`).once('value');

		const myProfile = resp.val();
		setProfile(myProfile);
	};

	useEffect(() => {
		getMyDriverProfile();
	}, []);

	const validate = (values) => {
		const errors = {};
		if (!values.displayName) {
			errors.displayName = 'Required';
		}
		if (!values.contactMethod) {
			errors.contactMethod = 'Required';
		}
		if (!values.contactLink) {
			errors.contactLink = 'Required';
		}
		// if (!values.entry) {
		// 	errors.entry = 'Required';
		// }
		return errors;
	};

	const initialValues = profile || {
		displayName: user.displayName,
		contactMethod: '',
		contactLink: '',
	};
	const formik = useFormik({
		initialValues,
		validate,
		onSubmit: async (values) => {
			const unix = moment().unix();
			const payload = {
				...values,
				uid: user.uid,
				time: values.time || unix,
				photoURL: user.photoURL,
			};
			await firebaseDb.ref(`driverProfiles/${location.collectionId}/${user.uid}`).set(payload);
		},
		enableReinitialize: true,
	});
	const { handleChange, handleSubmit, values, setFieldValue, errors, touched, isSubmitting } = formik;
	// console.log('values: ', values);

	let contactLinkLabel = null;
	if (values.contactMethod === 'fb') {
		contactLinkLabel = 'Facebook Profile URL';
	}

	return (
		<div>
			<h3>Drivers:</h3>

			<div>
				<p>Here you can set your driver profile. Shoppers will be able to give you ratings and reviews.</p>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							name="displayName"
							onChange={handleChange}
							value={values.displayName}
						/>
						{errors.displayName && touched.displayName && errors.displayName}
					</Form.Group>

					<Form.Group>
						<Form.Label>Contact Method</Form.Label>
						<Form.Label>
							<Button
								variant={values.contactMethod === 'fb' ? 'primary' : 'primary-outline'}
								onClick={() => setFieldValue('contactMethod', 'fb')}
							>
								Facebook
							</Button>
						</Form.Label>
						{errors.contactMethod && touched.contactMethod && errors.contactMethod}
					</Form.Group>

					{contactLinkLabel && (
						<Form.Group>
							<Form.Label>{contactLinkLabel}</Form.Label>
							<Form.Control
								type="text"
								name="contactLink"
								onChange={handleChange}
								value={values.contactLink}
							/>
							{errors.contactLink && touched.contactLink && errors.contactLink}
						</Form.Group>
					)}

					{/* <Form.Group>
						<Form.Label>Your shopping request</Form.Label>
						<ReactQuill
							theme="bubble"
							name="entry"
							value={values.entry || ''}
							onChange={(e) => setFieldValue('entry', e)}
							placeholder={`Hi ${location.city}! I need a shopper!`}
						/>
						{errors.entry && touched.entry && errors.entry}
					</Form.Group> */}
					<Button variant="outline-primary" type="submit" disabled={isSubmitting}>
						Publish
					</Button>
				</Form>
			</div>
		</div>
	);
};
