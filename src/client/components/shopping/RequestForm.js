import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Button, ToggleButton, ToggleButtonGroup, Modal, Form, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useFormik } from 'formik';
import { firebaseDb } from '../../services/firebase';
const moment = require('moment');

export const RequestForm = () => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const [entry, setEntry] = useState();
	const getMyEntry = async () => {
		const resp = await firebaseDb.ref(`shopping/${location.collectionId}/${user.uid}`).once('value');

		const myEntry = resp.val();
		setEntry(myEntry);
		setLoading(false);
	};

	useEffect(() => {
		if (user) {
			getMyEntry();
		}
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
		if (!values.entry) {
			errors.entry = 'Required';
		}
		return errors;
	};

	const initialValues = entry || {
		displayName: (user && user.displayName) || '',
		contactMethod: '',
		contactLink: '',
		entry: '',
		status: 'open',
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
			await firebaseDb.ref(`shopping/${location.collectionId}/${user.uid}`).set(payload);
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
			<h3>Shoppers:</h3>

			<div>
				<p>
					Here you can set your personal shopper ad. You don't <i>have</i> to include the entire list. If
					someone is available to take your order, you can provide the list privately. A simple greeting
					message will suffice.
				</p>
				<Form onSubmit={handleSubmit}>
					{entry && (
						<Form.Group>
							<Form.Label>Status</Form.Label>
							<p>Set to 'Filled' when you've found someone to fulfill your order.</p>
							<Form.Row>
								<Form.Label>
									<Button
										variant={values.status === 'open' ? 'primary' : 'primary-outline'}
										checked={values.status === 'open'}
										onClick={() => setFieldValue('status', 'open')}
									>
										Open
									</Button>
								</Form.Label>
								<Form.Label>
									<Button
										variant={values.status === 'urgent' ? 'primary' : 'primary-outline'}
										onClick={() => setFieldValue('status', 'urgent')}
									>
										Urgent
									</Button>
								</Form.Label>
								<Form.Label>
									<Button
										variant={values.status === 'filled' ? 'primary' : 'primary-outline'}
										onClick={() => setFieldValue('status', 'filled')}
									>
										Filled
									</Button>
								</Form.Label>
							</Form.Row>
						</Form.Group>
					)}
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

					<Form.Group>
						<Form.Label>Your shopping request</Form.Label>
						<ReactQuill
							theme="bubble"
							name="entry"
							value={values.entry || ''}
							onChange={(e) => setFieldValue('entry', e)}
							placeholder={`Hi ${location.city}! I need a shopper!`}
						/>
						{errors.entry && touched.entry && errors.entry}
					</Form.Group>
					<Button variant="outline-primary" type="submit" disabled={isSubmitting}>
						Publish
					</Button>
				</Form>
			</div>
		</div>
	);
};
