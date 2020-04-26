import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../../context/UserContext';
import { AdminContext } from '../../../context/AdminContext';
import { Table, Row, Col, Button, ButtonGroup, Card, Tab, Nav, Form } from 'react-bootstrap';
import { firebaseDb } from '../../../services/firebase';
import { getStoresByLocation } from '../../../services/yelp';
import { map, keys, differenceBy, concat, keyBy } from 'lodash';

export const Suggestions = () => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [suggestions, setSuggestions] = useState();
	const [disabled, setDisabled] = useState();
	const [savingSuggestion, setSavingSuggestion] = useState();
	const [updateCount, setUpdateCount] = useState(0);
	const [lastUpdated, setLastUpdated] = useState();

	useEffect(() => {
		getSuggestions();
	}, []);

	const getSuggestions = async () => {
		firebaseDb.ref(`suggestions/cities`).on('value', (snapshot) => {
			const results = snapshot.val();
			setSuggestions(
				keys(results).map((key) => {
					return {
						...results[key],
						key,
					};
				})
			);
		});
	};

	const removeSuggestion = async (sug) => {
		await firebaseDb.ref(`suggestions/cities/${sug.key}`).set({});
		getSuggestions();
		return true;
	};

	const addCityAndStores = async (sug) => {
		setUpdateCount(0);
		setDisabled(true);
		setSavingSuggestion(sug);

		// Check if city exists
		const existsResponse = await firebaseDb.ref(`locations/${sug.state}/${sug.city}`).once('value');
		const exists = existsResponse.val();

		// Add City
		if (!exists) {
			const collectionId = `${sug.state}_${sug.city}`;
			await firebaseDb.ref(`locations/${sug.state}/${sug.city}`).set({
				name: sug.city,
				state: sug.state,
				collectionId,
			});
		}

		const resp = await firebaseDb.ref(`stores/${sug.state}/${sug.city}`).once('value');
		const assignedStores = resp.val();
		const locationQuery = `${sug.city}, ${sug.state}`;
		const yelpResponse = await getStoresByLocation(locationQuery);
		const storeList = yelpResponse.stores;
		const newStores = differenceBy(storeList, assignedStores, 'id');
		const newStoreCount = newStores.length;
		setUpdateCount(updateCount + newStoreCount);
		let combinedList = concat(assignedStores, newStores);
		combinedList = keyBy(combinedList, 'id');
		await firebaseDb.ref(`stores/${sug.state}/${sug.city}`).set(combinedList);

		// Remove suggestion
		removeSuggestion(sug);

		setLastUpdated(locationQuery);
		setSavingSuggestion(null);
		setDisabled(null);
	};

	const actions = (sug) => {
		const addLabel = savingSuggestion == sug ? `Saving...` : `Add City and Stores`;
		return (
			<ButtonGroup>
				<Button disabled={disabled} onClick={(e) => removeSuggestion(sug)}>
					Remove
				</Button>
				<Button disabled={disabled} onClick={(e) => addCityAndStores(sug)}>
					{addLabel}
				</Button>
			</ButtonGroup>
		);
	};

	const UpdateCount = () => {
		if (updateCount > 0 && !savingSuggestion) {
			return <h4>{`${updateCount} stores added to ${lastUpdated}`}</h4>;
		} else {
			return null;
		}
	};

	return (
		<div>
			<h2>Suggestions</h2>
			<UpdateCount />
			{suggestions && (
				<Table>
					<thead>
						<tr>
							<th>State</th>
							<th>City</th>
							<th>Name</th>
							<th>Email</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{suggestions.map((sug, i) => {
							return (
								<tr key={i}>
									<td>{sug.state}</td>
									<td>{sug.city}</td>
									<td>{sug.userName}</td>
									<td>{sug.userEmail}</td>
									<td>{actions(sug)}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
		</div>
	);
};
