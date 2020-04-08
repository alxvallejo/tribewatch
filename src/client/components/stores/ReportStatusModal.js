import React, { useContext, useState } from 'react';
import { Login } from '../Login';
import { UserContext } from '../../context/UserContext';
import { firebaseDb } from '../../services/firebase';
import { Button, Form, Card, Modal } from 'react-bootstrap';
import { ItemsForm, StoreItemsFilter, ItemStatuses } from './StoreItems';
import { ItemStatusBadge, TrafficStatusBadge } from './badges';
import { map, keys, concat, join, groupBy } from 'lodash';

const moment = require('moment');

export const ReportStatusModal = ({ selectedStore, handleItemFormClose }) => {
	const [{ user, location, favorites, storeList, featuredStores }, userDispatch] = useContext(UserContext);
	const { city, state } = location;

	const setItemStatus = async (status, item) => {
		const unix = moment().unix();
		const newAvailability = {
			item: item.name,
			user: user.displayName,
			time: unix,
			status: status.name,
		};
		firebaseDb.ref(`stores/${state}/${city}/${selectedStore.id}/items/${item.id}`).set(newAvailability);
		handleItemFormClose();
	};

	const setTrafficStatus = async (trafficStatus) => {
		const unix = moment().unix();
		const newTrafficStatus = {
			user: user.displayName,
			time: unix,
			status: trafficStatus.name,
		};
		handleItemFormClose();
		await firebaseDb.ref(`stores/${state}/${city}/${selectedStore.id}/traffic`).set(newTrafficStatus);
	};

	if (!user) {
		return (
			<Modal show={!!selectedStore} onHide={handleItemFormClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>
						<div className="h5 mb-1">Login to report status</div>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Login handleClose={handleItemFormClose} />
				</Modal.Body>
			</Modal>
		);
	}

	return (
		<Modal show={!!selectedStore} onHide={handleItemFormClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>
					<div className="h5 mb-1">Report Status for:</div>
					{selectedStore.name}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ItemsForm store={selectedStore} setItemStatus={setItemStatus} setTrafficStatus={setTrafficStatus} />
			</Modal.Body>
		</Modal>
	);
};
