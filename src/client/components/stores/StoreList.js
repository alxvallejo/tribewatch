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
import { ItemStatuses, StoreItems, StoreItemsModal } from './StoreItems';
import { map, words } from 'lodash';
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
			if (!status) {
				return;
			}
			const dateChecked = moment.unix(item.time).format('M/D h:m a');
			return (
				<OverlayTrigger
					key={i}
					placement="top"
					overlay={
						<Tooltip id={`${storeItem.id}_${i}`}>
							{item.item}
							<br />
							{dateChecked} - {item.user}
						</Tooltip>
					}
				>
					<Badge variant={status.variant}>
						<i className={`mr-1 fas ${storeItem.icon}`} />
						{item.status}
					</Badge>
				</OverlayTrigger>
			);
		};

		return (
			<div class="col-md-4 mb-4 d-flex">
				<Card key={i}>
					<Card.Img
						variant="top"
						src={store.image_url}
					/>
					<Card.Body>
						<h3>
							{store.name}
						</h3>
						<Card.Text>
							{store.location.address1}
							<br />
							{store.location.city}
						</Card.Text>
						<div className="badges">
							{items && items.map((item, i) => showItemStatus(item, i))}
						</div>
					</Card.Body>

					<Card.Footer>
						<a className="update-status" role="button" onClick={() => setSelectedStoreIndex(i)}>
							Update Status
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
			<div class="row mt-5">
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
						<StoreItemsModal store={selectedStore} setItemStatus={setItemStatus} />
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
};
