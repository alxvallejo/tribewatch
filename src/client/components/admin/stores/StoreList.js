import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form, Card, CardDeck, ListGroup } from 'react-bootstrap';
import { getStoresByLocation } from '../../../services/yelp';
import { map, merge, differenceBy, concat } from 'lodash';

export const StoreList = () => {
	const [{ cities, selectedState, city, storeList }, adminDispatch] = useContext(AdminContext);
	const [combinedStores, setCombinedStores] = useState();

	const locationQuery = `${city.name}, ${city.state}`;

	const listStores = async () => {
		// First get existing stores and prevent overwrite
		const resp = await firebaseDb.ref(`stores/${selectedState}/${city.name}`).once('value');
		const assignedStores = resp.val();
		const yelpResponse = await getStoresByLocation(locationQuery);
		const storeList = yelpResponse.stores;
		const newStores = differenceBy(storeList, assignedStores, 'id');
		const combinedList = concat(assignedStores, newStores);
		console.log('combinedList: ', combinedList);
		adminDispatch({
			type: 'SET_STORE_LIST',
			storeList: newStores
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
		console.log('combinedStores: ', combinedStores);
		const resp = await firebaseDb.ref(`stores/${selectedState}/${city.name}`).set(combinedStores);
	};

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
		<Container>
			<Button onClick={() => addStores()}>Add New Stores</Button>
			<CardDeck>
				{storeList.map((store, i) => {
					return storeListItem(store, i);
				})}
			</CardDeck>
		</Container>
	);
};
