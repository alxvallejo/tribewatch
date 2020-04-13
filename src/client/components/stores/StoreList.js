import React, { useContext, useState } from 'react';
import { ReportStatusModal } from './ReportStatusModal';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Button, Form, Card, Modal } from 'react-bootstrap';
import { ItemsForm, StoreItemsFilter, ItemStatuses } from './StoreItems';
import { ItemStatusBadge, TrafficStatusBadge } from './badges';
import { map, keys, concat, join, groupBy } from 'lodash';
import Ticker from 'react-ticker';

export const StoreList = () => {
	const [{ user, location, favorites, storeList, featuredStores }, userDispatch] = useContext(UserContext);
	const { city, state } = location;
	const [searchFilter, setSearchFilter] = useState();
	const [itemFilters, setItemFilters] = useState();
	const [selectedStore, setSelectedStore] = useState();

	const storeCard = (store, i) => {
		if (!store.location) {
			return null;
		}
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
		filteredStores = storeList.filter((store) => {
			store.name.toLowerCase().search(searchFilter.toLowerCase()) != -1;
		});
	}
	if (itemFilters && itemFilters.length > 0) {
		filteredStores = filteredStores.filter((store) => {
			if (!store.items) {
				return false;
			}
			const storeItemKeys = keys(store.items);

			let hasItem = false;
			itemFilters.map((id) => {
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
		filteredStores = filteredStores.filter((s) => {
			if (favorites.includes(s.id)) {
				favoriteStores.push(s);
				return false;
			} else {
				return true;
			}
		});
		filteredStores = concat(favoriteStores, filteredStores);
	}

	const search = (e) => {
		e.preventDefault();
		if (e.keyCode === 13) {
			return;
		}

		const term = e.target.value;

		setSearchFilter(term);
	};

	const handleItemFormClose = () => {
		setSelectedStore(null);
	};

	const addFavorite = async (store) => {
		let newFavorites = favorites;
		newFavorites.push(store.id);
		userDispatch({
			type: 'SET_FAVORITES',
			favorites: newFavorites,
		});
		await firebaseDb.ref(`users/${user.uid}/favorites`).set(newFavorites);
	};

	const removeFavorite = async (store) => {
		const newFavorites = favorites.filter((f) => f !== store.id);
		userDispatch({
			type: 'SET_FAVORITES',
			favorites: newFavorites,
		});
		await firebaseDb.ref(`users/${user.uid}/favorites`).set(newFavorites);
	};

	const setItemFilter = (item) => {
		let newItemFilters;
		if (itemFilters && itemFilters.includes(item.id)) {
			newItemFilters = itemFilters.filter((id) => id != item.id);
		} else {
			newItemFilters = itemFilters ? [...itemFilters, item.id] : [item.id];
		}
		setItemFilters(newItemFilters);
	};

	// types: positive, neutral, negative
	const buildMarqueeItems = (storeHighlight) => {
		return storeHighlight.map(highlights);
	};

	const StoreReportMarquee = () => {
		if (!featuredStores) {
			return null;
		}
		let storeHighlights = featuredStores.map((store) => {
			if (store.items) {
				let groupedItems = groupBy(store.items, 'status');
				groupedItems = keys(groupedItems).map((key) => {
					const items = groupedItems[key].map((item) => item.item);
					return {
						store: store.name,
						status: key,
						items,
					};
				});
				return groupedItems;
			}
		});

		const highlightMarkup = storeHighlights.map((highlights) => {
			if (!highlights) {
				return null;
			}
			return highlights.map((highlight, i) => {
				const items = join(highlight.items, ', ');
				const itemStatus = ItemStatuses.find((x) => x.name == highlight.status);
				const className = itemStatus ? itemStatus.variant : '';
				const highlighTxt = `${highlight.store} is ${highlight.status} of ${items}`;

				return (
					<span key={i} className={`bg-${className} font-weight-bold`} style={{ marginRight: '8rem' }}>
						{highlighTxt}
					</span>
				);
			});
		});

		return <Ticker speed={3}>{(index) => <div style={{ whiteSpace: 'nowrap' }}>{highlightMarkup}</div>}</Ticker>;
	};

	return (
		<div>
			<div className="mb-4">
				<StoreReportMarquee />
			</div>
			<div>
				<Form onSubmit={(e) => e.preventDefault()}>
					<Form.Group controlId="searchFilter" className="has-icon">
						<Form.Control placeholder="Search Stores" type="text" onChange={(e) => search(e)} />
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
				<ReportStatusModal selectedStore={selectedStore} handleItemFormClose={handleItemFormClose} />
			)}
		</div>
	);
};
