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
			firebaseDb.ref(`stores/${state}/${city}`).on('value', snapshot => {
				const assignedStores = Object.values(snapshot.val());
				userDispatch({
					type: 'SET_STORE_LIST',
					storeList: assignedStores
				});
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
