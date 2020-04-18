import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Image, Row, Col, Badge } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useFormik } from 'formik';
import { RequestForm } from './RequestForm';
import { firebaseDb } from '../../services/firebase';
import { map } from 'lodash';
const moment = require('moment');

export const Shoppers = () => {
	const [{ user, location, profile }, userDispatch] = useContext(UserContext);
	console.log('profile: ', profile);
	const [shopEntries, setShopEntries] = useState();

	const getEntries = async () => {
		firebaseDb.ref(`shopping/${location.collectionId}`).on('value', (snapshot) => {
			const values = snapshot.val();
			if (values) {
				const entries = map(values);
				setShopEntries(entries);
			}
		});
	};

	useEffect(() => {
		getEntries();
	}, [location]);

	const contactButton = (entry) => {
		switch (entry.contactMethod) {
			case 'fb':
				return (
					<a href={entry.contactLink} target="_blank">
						<Badge variant="primary">
							<i className="fab fa-facebook mr-1" />
							Contact
						</Badge>
					</a>
				);
			default:
				return '';
		}
	};

	return (
		<Row>
			<Col>
				<RequestForm />
			</Col>
			<Col className="ml-4">
				<div>
					{shopEntries &&
						shopEntries.map((entry, i) => {
							const displayDate = moment(entry.unix).fromNow();

							return (
								<Row key={i}>
									<div className="mr-4">
										<Image roundedCircle src={entry.photoURL} style={{ width: 50 }} />
									</div>
									<div>
										<Row>
											<Col>
												<h5>{entry.displayName}</h5>
												{contactButton(entry)}
											</Col>
											<div>
												<h5>
													<i>{displayDate}</i>
												</h5>
												<ReactQuill value={entry.entry} readOnly={true} theme={'bubble'} />
											</div>
										</Row>
									</div>
								</Row>
							);
						})}
				</div>
			</Col>
		</Row>
	);
};
