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
			firebaseDb.ref(`locations/${state}/${city}/stores`).on('value', snapshot => {
				const assignedStores = snapshot.val();

				userDispatch({
					type: 'SET_STORE_LIST',
					storeList: assignedStores
				});
			});
		};
		cityStores();
	}, [location]);

	return (
		<Container fluid>
			<h2>Stores</h2>
			<StoreList />
		</Container>
	);
};
