import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form, Card, CardDeck, ListGroup } from 'react-bootstrap';
import { getStoresByLocation } from '../../../services/yelp';

export const StoreList = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);

	const locationQuery = `${city.name}, state`;

	useEffect(() => {
		// const mergeStoreList = async () => {
		// 	const resp = await firebaseDb.ref(`locations/${selectedState}/${city.name}/stores`).once('value');
		// 	const assignedStores = resp.val();
		// 	console.log('assignedStores: ', assignedStores);
		// 	const list = await getStoresByLocation(locationQuery, 'grocery');
		// 	const mergedStoreList = list.map(store => {
		// 		if (assignedStores)
		// 	})
		// 	adminDispatch({
		// 		type: 'SET_STORE_LIST',
		// 		storeList: list.stores
		// 	});
		// }
	}, []);

	const storeListItem = (store, i) => {
		return (
			<Card key={i} style={{ minWidth: '18rem', height: 200 }}>
				<Card.Img
					variant="top"
					src={store.image_url}
					className="h-25"
					style={{ objectFit: 'none', objectPosition: 'center' }}
				/>
				<Card.Body>
					<Card.Title>{store.name}</Card.Title>
					<Card.Text>
						<i className="fas fa-toilet-paper" />
					</Card.Text>
				</Card.Body>
			</Card>
		);
	};

	if (!storeList) {
		return 'Loading';
	}

	return (
		<CardDeck>
			{storeList.map((store, i) => {
				return storeListItem(store, i);
			})}
		</CardDeck>
	);
};
