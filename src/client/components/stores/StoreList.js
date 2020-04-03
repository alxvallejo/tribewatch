import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import {
	Container,
	Row,
	Col,
	Button,
	Form,
	Card,
	CardDeck,
	Modal,
	Badge,
	OverlayTrigger,
	Tooltip
} from 'react-bootstrap';
import { ItemStatuses, StoreItems, StoreItemsModal, TrafficStatuses } from './StoreItems';
import { ItemStatusBadge, TrafficStatusBadge } from './badges';
import { map, words } from 'lodash';
const moment = require('moment');

export const StoreList = () => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	const { city, state } = location;
	const [searchFilter, setSearchFilter] = useState();
	const [selectedStoreIndex, setSelectedStoreIndex] = useState();

	const selectedStore = selectedStoreIndex || selectedStoreIndex === 0 ? storeList[selectedStoreIndex] : null;

	const storeCard = (store, i) => {
		const items = store.items ? map(store.items) : null;
		if (items) {
			console.log('items: ', items);
		}

		return (
			<div key={i} className="col-md-4 mb-4 d-flex">
				<Card>
					<Card.Img variant="top" src={store.image_url} />
					<Card.Body>
						<h3>{store.name}</h3>
						<Card.Text>
							{store.location.address1}
							<br />
							{store.location.city}
						</Card.Text>
						<div className="badges">
							<label>Traffic</label>
							<TrafficStatusBadge store={store} />
						</div>
						<div className="badges">
							<label>
								Inventory
							</label>
							{items && items.map((item, i) => <ItemStatusBadge key={i} item={item} />)}
						</div>
					</Card.Body>

					<Card.Footer>
						<a className="btn btn-outline-dark" role="button" onClick={() => setSelectedStoreIndex(i)}>
							Report Status
						</a>
					</Card.Footer>
				</Card>
			</div>
		);
	};

	if (!storeList) {
		return 'Loading';
	}

	let filteredStores = storeList;
	if (searchFilter) {
		filteredStores = storeList.filter(store => store.name.toLowerCase().search(searchFilter.toLowerCase()) != -1);
	}

	const search = e => {
		const term = e.target.value;
		setSearchFilter(term);
	};

	const handleClose = () => {
		setSelectedStoreIndex(null);
	};

	const setItemStatus = async (status, item) => {
		const unix = moment().unix();
		const newAvailability = {
			item: item.name,
			user: profile.name,
			time: unix,
			status: status.name
		};
		handleClose();
		await firebaseDb
			.ref(`locations/${state}/${city}/stores/${selectedStoreIndex}/items/${item.id}`)
			.set(newAvailability);
	};

	const setTrafficStatus = async trafficStatus => {
		const unix = moment().unix();
		const newTrafficStatus = {
			user: profile.name,
			time: unix,
			status: trafficStatus.name
		};
		handleClose();
		await firebaseDb.ref(`locations/${state}/${city}/stores/${selectedStoreIndex}/traffic`).set(newTrafficStatus);
	};

	return (
		<div>
			<div>
				<h3>Filters</h3>
				<Form>
					<Form.Group controlId="searchFilter">
						<Form.Label>Search</Form.Label>
						<Form.Control type="text" onChange={e => search(e)} />
					</Form.Group>
				</Form>
			</div>
			<div className="row mt-5">
				{filteredStores.map((store, i) => {
					return storeCard(store, i);
				})}
			</div>
			{selectedStore && (
				<Modal show={!!selectedStore} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Set Availability for {selectedStore.name}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<StoreItemsModal
							store={selectedStore}
							setItemStatus={setItemStatus}
							setTrafficStatus={setTrafficStatus}
						/>
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
};
