import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button, Form, Card, CardDeck, Modal, Badge } from 'react-bootstrap';
import { ItemStatuses, StoreItems, StoreItemsModal } from './StoreItems';
import { map } from 'lodash';
const moment = require('moment');

export const StoreList = () => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	const { city, state } = location;
	const [searchFilter, setSearchFilter] = useState();
	const [selectedStoreIndex, setSelectedStoreIndex] = useState();

	console.log('storeList', storeList);
	console.log('selectedStoreIndex', selectedStoreIndex);
	const selectedStore = selectedStoreIndex || selectedStoreIndex === 0 ? storeList[selectedStoreIndex] : null;

	const storeCard = (store, i) => {
		const items = store.items ? map(store.items) : null;
		if (items) {
			console.log('items: ', items);
		}

		const showItemStatus = (item, i) => {
			const status = ItemStatuses.find(x => x.name == item.status);
			const storeItem = StoreItems.find(x => x.name == item.item);
			console.log('storeItem: ', storeItem);
			if (!status) {
				return;
			}
			return (
				<Badge key={i} variant={status.variant}>
					<i className={`mr-1 fas ${storeItem.icon}`} />
					{item.status}
				</Badge>
			);
		};

		return (
			<Card key={i} style={{ minWidth: '18rem', height: 300 }}>
				<Card.Img
					variant="top"
					src={store.image_url}
					className="h-25"
					style={{ objectFit: 'none', objectPosition: 'center' }}
				/>
				<Card.Body>
					<Card.Title>{store.name}</Card.Title>
					<Card.Text>
						{store.location.address1}
						<br />
						{store.location.city}
					</Card.Text>
					<Card.Text>
						<a role="button" onClick={() => setSelectedStoreIndex(i)} className="text-primary">
							Update Status
						</a>
					</Card.Text>
				</Card.Body>

				<Card.Footer>{items && items.map((item, i) => showItemStatus(item, i))}</Card.Footer>
			</Card>
		);
	};

	if (!storeList) {
		return 'Loading';
	}

	let filteredStores = storeList;
	if (searchFilter) {
		filteredStores = storeList.filter(store => store.name.search(searchFilter) != -1);
	}

	const search = e => {
		const term = e.target.value;
		setSearchFilter(term);
	};

	const handleClose = () => {
		setSelectedStoreIndex(null);
	};

	const setItemStatus = async (status, item) => {
		console.log('selectedStoreIndex', selectedStoreIndex);
		console.log('item: ', item);
		console.log('user', user);
		console.log('profile', profile);
		const unix = moment().unix();
		console.log('unix: ', unix);
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

	return (
		<Container fluid>
			<Card>
				<h3>Filters</h3>
				<Form>
					<Form.Group controlId="searchFilter">
						<Form.Label>Search</Form.Label>
						<Form.Control type="text" onChange={e => search(e)} />
					</Form.Group>
				</Form>
			</Card>
			<CardDeck>
				{filteredStores.map((store, i) => {
					return storeCard(store, i);
				})}
			</CardDeck>
			{selectedStore && (
				<Modal show={!!selectedStore} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Set Availability for {selectedStore.name}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<StoreItemsModal store={selectedStore} setItemStatus={setItemStatus} />
					</Modal.Body>
				</Modal>
			)}
		</Container>
	);
};
