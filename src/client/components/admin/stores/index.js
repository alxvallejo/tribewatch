import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { NewStore } from './NewStore';
import { StoreList } from './StoreList';
import { getStoresByLocation } from '../../../services/yelp';

export const Stores = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);
	const locationQuery = `${city.name}, state`;

	useEffect(() => {
		const cityStores = async () => {
			const resp = await firebaseDb.ref(`locations/${selectedState}/${city.name}/stores`).once('value');
			const assignedStores = resp.val();
			console.log('assignedStores: ', assignedStores);
		};
		cityStores();
		const listStores = async () => {
			const list = await getStoresByLocation(locationQuery, 'grocery');
			adminDispatch({
				type: 'SET_STORE_LIST',
				storeList: list.stores
			});
		};
		listStores();
	}, [city]);

	const overwriteAllStores = async () => {
		const resp = await firebaseDb.ref(`locations/${selectedState}/${city.name}/stores`).set(storeList);
		console.log('resp: ', resp);
	};

	return (
		<div>
			<h2>Stores</h2>
			<Button onClick={() => overwriteAllStores()}>Overwrite All Store Data</Button>
			<StoreList />
		</div>
	);
};
