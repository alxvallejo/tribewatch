import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form, Card, CardDeck, ListGroup } from 'react-bootstrap';
import { getStoresByLocation } from '../../../services/yelp';
import { keyBy, map, merge, differenceBy, concat } from 'lodash';

export const StoreList = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);
	console.log('city: ', city);
	const [combinedStores, setCombinedStores] = useState();
	const [saving, setSaving] = useState();

	const locationQuery = `${city.name}, ${city.state}`;

	const listStores = async () => {
		// First get existing stores and prevent overwrite
		const resp = await firebaseDb.ref(`stores/${selectedState}/${city.name}`).once('value');
		const assignedStores = resp.val();
		const yelpResponse = await getStoresByLocation(locationQuery);
		const storeList = yelpResponse.stores;
		const newStores = differenceBy(storeList, assignedStores, 'id');
		let combinedList = concat(assignedStores, newStores).filter((x) => x !== undefined);
		combinedList = keyBy(combinedList, 'id');
		adminDispatch({
			type: 'SET_STORE_LIST',
			storeList: newStores,
		});
		// Since firebase has no concept of arrays, we need to set the combined store list
		setCombinedStores(combinedList);
	};

	useEffect(() => {
		console.log('city changed', city);
		listStores();
	}, [city]);

	const addStores = async () => {
		if (!combinedStores) {
			return;
		}
		setSaving(true);
		const resp = await firebaseDb.ref(`stores/${selectedState}/${city.name}`).set(combinedStores);

		setSaving(null);
		adminDispatch({
			type: 'SET_STORE_LIST',
			storeList: [],
		});
	};

	if (!storeList) {
		return 'Loading';
	}

	return (
		<Container>
			<Button disabled={saving} onClick={() => addStores()}>
				{saving ? 'Saving ...' : 'Add New Stores'}
			</Button>
			<ul>
				{storeList.map((store, i) => {
					return <li key={i}>{store.name}</li>;
				})}
			</ul>
		</Container>
	);
};
