import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { ShopperContext } from '../../context/ShopperContext';
import { Image, Row, Col, Badge, Form, Button, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { RequestForm } from './RequestForm';
import { DriverForm } from './DriverForm';

import { firebaseDb } from '../../services/firebase';
import { map } from 'lodash';

const moment = require('moment');

export const Shoppers = () => {
	const [{ user, location, profile }, userDispatch] = useContext(UserContext);
	const [{ shopEntries, entry }, shopperDispatch] = useContext(ShopperContext);
	const [tab, setTab] = useState('driver');
	// const [shopEntries, setShopEntries] = useState();
	// const [messageEntry, setMessageEntry] = useState();

	const getEntries = async () => {
		firebaseDb.ref(`shopping/${location.collectionId}`).on('value', (snapshot) => {
			const values = snapshot.val();
			if (values) {
				const entries = map(values);
				// setShopEntries(entries);
				shopperDispatch({
					type: 'SET_SHOPPER_ENTRIES',
					shopEntries: entries,
				});
			}
		});
	};

	useEffect(() => {
		if (location) {
			getEntries();
		}
	}, [location]);

	const contactButton = (shopperEntry) => {
		return (
			<a onClick={() => shopperDispatch({ type: 'SET_ENTRY', entry: shopperEntry })}>
				<Badge variant="secondary">Message</Badge>
			</a>
		);
	};

	return (
		<Row>
			<Col>
				<Form>
					<Form.Group>
						<Form.Label>I'm a</Form.Label>
						<Row>
							<Form.Label>
								<Button
									variant={tab === 'driver' ? 'primary' : 'primary-outline'}
									onClick={() => setTab('driver')}
								>
									Driver
								</Button>
							</Form.Label>
							<Form.Label>
								<Button
									variant={tab === 'shopper' ? 'primary' : 'primary-outline'}
									onClick={() => setTab('shopper')}
								>
									Shopper
								</Button>
							</Form.Label>
						</Row>
					</Form.Group>
				</Form>
				{tab == 'shopper' && <RequestForm />}
				{tab == 'driver' && <DriverForm />}
			</Col>
			<Col className="ml-4">
				<div>
					{shopEntries &&
						shopEntries.map((shopperEntry, i) => {
							const displayDate = moment(shopperEntry.unix).fromNow();

							return (
								<Row key={i}>
									<div className="mr-4">
										<Image roundedCircle src={shopperEntry.photoURL} style={{ width: 50 }} />
									</div>
									<div>
										<Row>
											<Col>
												<h5>{shopperEntry.displayName}</h5>
												{contactButton(shopperEntry)}
											</Col>
											<div>
												<h5>
													<i>{displayDate}</i>
												</h5>
												<ReactQuill
													value={shopperEntry.entry}
													readOnly={true}
													theme={'bubble'}
												/>
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
