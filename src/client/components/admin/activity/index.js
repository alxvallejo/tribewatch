import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../../context/UserContext';
import { AdminContext } from '../../../context/AdminContext';
import { Table, Row, Col, Button, ButtonGroup, Card, Tab, Nav, Form } from 'react-bootstrap';
import { firebaseDb } from '../../../services/firebase';
import { getStoresByLocation } from '../../../services/yelp';
import { map, flatten, keys, uniq, differenceBy, concat, keyBy } from 'lodash';

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
				return stateStores;
			})
			.filter((state) => state.length > 0);
		console.log('states: ', states);

		setStateStores(states);
	};

	const cityInfo = (city) => {
		const stores = city.stores;
		const storeItems = flatten(stores.map((store) => store.items));
		let storeItemReporters = storeItems.map((item) => {
			return item.user;
		});
		return uniq(storeItemReporters).length;
	};

	return (
		<div>
			<h2>Activity</h2>
			{stateStores &&
				stateStores.map((stateCities, stateIndex) => {
					return (
						<div key={stateIndex}>
							<Table>
								<thead>
									<tr>
										<th>City</th>
										<th># Reporters</th>
									</tr>
								</thead>
								<tbody>
									{stateCities.map((city, i) => {
										return (
											<tr key={i}>
												<td>{city.city}</td>
												<td>{cityInfo(city)}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</div>
					);
				})}
		</div>
	);
};
