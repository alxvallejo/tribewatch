import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { StoreList } from './StoreList';

export const Stores = () => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	const { city, state } = location;

	useEffect(() => {
		const cityStores = async () => {
			firebaseDb.ref(`stores/${state}/${city}`).on('value', (snapshot) => {
				const values = snapshot.val();
				if (values) {
					const assignedStores = Object.values(snapshot.val());
					const featuredStores = assignedStores.filter((store) => store.items || store.traffic);
					console.log('featuredStores: ', featuredStores);

					userDispatch({
						type: 'SET_STORE_LIST',
						storeList: assignedStores,
					});

					userDispatch({
						type: 'SET_FEATURED_STORES',
						featuredStores: featuredStores,
					});
				}
			});
		};
		cityStores();
	}, [location]);

	return (
		<div>
			<StoreList />
		</div>
	);
};
