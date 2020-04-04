import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { NewStore } from './NewStore';
import { StoreList } from './StoreList';
import { getStoresByLocation } from '../../../services/yelp';
import { map, keyBy, merge, differenceBy, concat } from 'lodash';

export const Stores = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);
	console.log('cities: ', cities);
	const [updating, setUpdating] = useState();
	const [updateCount, setUpdateCount] = useState(0);

	const updateAllStoresInState = async () => {
		setUpdating(true);
		adminDispatch({
			type: 'SET_STORE_LIST',
			storeList: null
		});
		const cityList = map(cities);
		cityList.map(async c => {
			const resp = await firebaseDb.ref(`stores/${c.state}/${c.name}`).once('value');
			const assignedStores = resp.val();
			const locationQuery = `${c.name}, ${c.state}`;
			const yelpResponse = await getStoresByLocation(locationQuery);
			const storeList = yelpResponse.stores;
			const newStores = differenceBy(storeList, assignedStores, 'id');
			adminDispatch({
				type: 'SET_STORE_LIST',
				storeList: newStores
			});
			const newStoreCount = newStores.length;
			setUpdateCount(updateCount + newStoreCount);
			let combinedList = concat(assignedStores, newStores);
			combinedList = keyBy(combinedList, 'id');
			await firebaseDb.ref(`stores/${c.state}/${c.name}`).set(combinedList);
		});
		setUpdating(null);
	};

	const updateButtonLabel = updating ? `Saving` : `Update all ${selectedState} stores`;

	return (
		<div>
			{selectedState && (
				<div>
					<Button disabled={updating} onClick={() => updateAllStoresInState()}>
						{updateButtonLabel}
					</Button>
					<div>{updateCount > 0 && `${updateCount} Stores Added.`}</div>
				</div>
			)}

			{city && (
				<Card>
					<h2>New Stores</h2>

					<StoreList />
				</Card>
			)}
		</div>
	);
};
