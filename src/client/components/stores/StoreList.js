import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Button, Form, Card, Modal } from 'react-bootstrap';
import { ItemStatuses, StoreItems, StoreItemsModal, TrafficStatuses, StoreItemsFilter } from './StoreItems';
import { ItemStatusBadge, TrafficStatusBadge } from './badges';
import { map, keys, concat, reverse, words, intersectionBy } from 'lodash';
const moment = require('moment');

export const StoreList = () => {
	const [{ user, location, preferences, profile, favorites, storeList }, userDispatch] = useContext(UserContext);
	const { city, state } = location;
	const [searchFilter, setSearchFilter] = useState();
	const [itemFilters, setItemFilters] = useState();
	const [selectedStore, setSelectedStore] = useState();

	const storeCard = (store, i) => {
		const items = store.items ? map(store.items) : null;
		const isStarred = favorites && favorites.includes(store.id);

		const star = () => {
			if (isStarred) {
				return (
					<a className="favorite selected" onClick={() => removeFavorite(store)}>
						<i className="fas fa-star" />
					</a>
				);
			} else {
				return (
					<a className="favorite" onClick={() => addFavorite(store)}>
						<i className="far fa-star" />
					</a>
				);
			}
		};

		return (
			<div key={i} className="col-md-6 col-lg-4 mb-4 d-flex">
				<Card>
					<Card.Img variant="top" src={store.image_url} />
					<Card.Body>
						<h3>{store.name}</h3>
						{star()}
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
							<label>Inventory</label>
							{items && items.map((item, i) => <ItemStatusBadge key={i} item={item} />)}
						</div>
					</Card.Body>

					<Card.Footer>
						<a className="btn btn-outline-dark" role="button" onClick={() => setSelectedStore(store)}>
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
	if (itemFilters && itemFilters.length > 0) {
		filteredStores = filteredStores.filter(store => {
			if (!store.items) {
				return false;
			}
			const storeItemKeys = keys(store.items);

			let hasItem = false;
			itemFilters.map(id => {
				if (storeItemKeys.includes(id)) {
					const itemStatus = store.items[id].status;
					if (itemStatus != 'Empty') {
						hasItem = true;
					}
				}
			});
			return hasItem;
		});
	}
	// Prioritize favorites
	if (favorites && favorites.length > 0) {
		let favoriteStores = [];
		filteredStores = filteredStores.filter(s => {
			if (favorites.includes(s.id)) {
				favoriteStores.push(s);
				return false;
			} else {
				return true;
			}
		});
		filteredStores = concat(favoriteStores, filteredStores);
	}

	const search = e => {
		const term = e.target.value;
		setSearchFilter(term);
	};

	const handleClose = () => {
		setSelectedStore(null);
	};

	const setItemStatus = async (status, item) => {
		const unix = moment().unix();
		const newAvailability = {
			item: item.name,
			user: user.displayName,
			time: unix,
			status: status.name
		};
		handleClose();
		await firebaseDb.ref(`stores/${state}/${city}/${selectedStore.id}/items/${item.id}`).set(newAvailability);
	};

	const setTrafficStatus = async trafficStatus => {
		const unix = moment().unix();
		const newTrafficStatus = {
			user: user.displayName,
			time: unix,
			status: trafficStatus.name
		};
		handleClose();
		await firebaseDb.ref(`stores/${state}/${city}/${selectedStore.id}/traffic`).set(newTrafficStatus);
	};

	const addFavorite = async store => {
		let newFavorites = favorites;
		newFavorites.push(store.id);
		userDispatch({
			type: 'SET_FAVORITES',
			favorites: newFavorites
		});
		await firebaseDb.ref(`users/${user.uid}/favorites`).set(newFavorites);
	};

	const removeFavorite = async store => {
		const newFavorites = favorites.filter(f => f !== store.id);
		userDispatch({
			type: 'SET_FAVORITES',
			favorites: newFavorites
		});
		await firebaseDb.ref(`users/${user.uid}/favorites`).set(newFavorites);
	};

	const setItemFilter = item => {
		let newItemFilters;
		if (itemFilters && itemFilters.includes(item.id)) {
			newItemFilters = itemFilters.filter(id => id != item.id);
		} else {
			newItemFilters = itemFilters ? [...itemFilters, item.id] : [item.id];
		}
		setItemFilters(newItemFilters);
	};

	return (
		<div>
			<div>
				<Form>
					<Form.Group controlId="searchFilter" className="has-icon">
						<Form.Control placeholder="Search Stores" type="text" onChange={e => search(e)} />
						<i className="fas fa-search"></i>
					</Form.Group>
					<StoreItemsFilter itemFilters={itemFilters} setItemFilter={setItemFilter} />
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
						<Modal.Title>
							<div className="h5 mb-1">Report Status for:</div>
							{selectedStore.name}
						</Modal.Title>
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
