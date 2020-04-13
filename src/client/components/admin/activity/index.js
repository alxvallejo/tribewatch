import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../../context/UserContext';
import { AdminContext } from '../../../context/AdminContext';
import { Table, Row, Col, Button, ButtonGroup, Card, Tab, Nav, Form } from 'react-bootstrap';
import { firebaseDb } from '../../../services/firebase';
import { getStoresByLocation } from '../../../services/yelp';
import { map, flatten, keys, join, groupBy, orderBy } from 'lodash';

const moment = require('moment');

export const Activity = () => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [stateStores, setStateStores] = useState();

	useEffect(() => {
		getActivity();
	}, []);

	const getActivity = async () => {
		const resp = await firebaseDb.ref(`stores`).once('value');
		let states = resp.val();
		states = keys(states)
			.map((state) => {
				const cities = states[state];
				let stateStores = keys(cities)
					.map((city) => {
						let cityStores = map(cities[city]).filter((store) => !!store.items);
						return {
							city,
							stores: cityStores,
						};
					})
					.filter((city) => city.stores.length > 0);
				return {
					state,
					stores: stateStores,
				};
			})
			.filter((state) => state.stores.length > 0);

		setStateStores(states);
	};

	const cityReport = (city) => {
		const stores = city.stores;
		let storeItems = flatten(stores.map((store) => map(store.items)));
		storeItems = groupBy(storeItems, 'user');
		storeItems = keys(storeItems).map((key, i) => {
			return {
				items: storeItems[key],
				user: key,
			};
		});
		return (
			<Table>
				<thead>
					<tr>
						<th>User</th>
						<th>Date</th>
						<th>Items Reported</th>
					</tr>
				</thead>
				<tbody>
					{storeItems.map((store, storeIndex) => {
						const storeItems = store.items;
						const latestStoreTime = orderBy(storeItems, 'time');
						const displayTime = moment.unix(latestStoreTime[0].time).fromNow();
						const items = store.items.map((item) => item.item);
						const itemCount = items.length;
						return (
							<tr key={storeIndex}>
								<td style={{ width: '33%' }}>{store.user}</td>
								<td style={{ width: '33%' }}>{displayTime}</td>
								<td style={{ width: '33%' }}>{itemCount}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	};

	return (
		<div>
			<h2>Activity</h2>
			{stateStores &&
				stateStores.map((state, stateIndex) => {
					return (
						<div key={stateIndex}>
							<h2>{state.state}</h2>
							{state.stores.map((stores, i) => {
								const city = stores.city;

								return (
									<div key={i}>
										<h3>{city}</h3>
										{cityReport(stores)}
									</div>
								);
							})}
						</div>
					);
				})}
		</div>
	);
};
