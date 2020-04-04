import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { NewStore } from './NewStore';
import { StoreList } from './StoreList';
import { getStoresByLocation } from '../../../services/yelp';
import { map, merge, differenceBy, concat } from 'lodash';

export const Stores = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);
	console.log('cities: ', cities);
	const [updating, setUpdating] = useState();
	const [updateCount, setUpdateCount] = useState(0);

	const updateAllStoresInState = async () => {
		setUpdating(true);
		const cityList = map(cities);
		cityList.map(async c => {
			const resp = await firebaseDb.ref(`locations/${c.state}/${c.name}/stores`).once('value');
			const assignedStores = resp.val();
			const locationQuery = `${c.name}, ${c.state}`;
			const groceryStores = await getStoresByLocation(locationQuery, 'grocery');
			const pharmacies = await getStoresByLocation(locationQuery, 'pharmacy');
			const storeList = merge(groceryStores.stores, pharmacies.stores);
			const newStores = differenceBy(storeList, assignedStores, 'id');
			const newStoreCount = newStores.length;
			setUpdateCount(updateCount + newStoreCount);
			const combinedList = concat(assignedStores, newStores);
			firebaseDb.ref(`locations/${c.state}/${c.name}/stores`).set(combinedList);
		});
		setUpdating(null);
	};

	const updateButtonLabel = updating ? `Saving` : `Update all ${selectedState} stores`;

	return (
		<div>
			{selectedState && (
				<div>
					<Button disabled={updating} onClick={() => updateAllStoresInState()}>
						Update All Stores in State
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
