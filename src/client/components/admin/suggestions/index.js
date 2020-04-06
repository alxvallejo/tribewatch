import React, { useContext, useState, useEffect } from 'react';

import { UserContext } from '../../../context/UserContext';
import { AdminContext } from '../../../context/AdminContext';
import { Table, Row, Col, Button, ButtonGroup, Card, Tab, Nav, Form } from 'react-bootstrap';
import { firebaseDb } from '../../../services/firebase';

export const Suggestions = () => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [suggestions, setSuggestions] = useState();

	useEffect(() => {
		const getSuggestions = async () => {
			const resp = await firebaseDb.ref(`suggestions/cities`).once('value');
			const results = resp.val();
			setSuggestions(results);
		};
		getSuggestions();
	}, []);

	const removeSuggestion = (sug) => {
		console.log('sug: ', sug);
	};

	const addCityAndStores = (sug) => {
		console.log('sug: ', sug);
	};

	const actions = (sug) => {
		return (
			<ButtonGroup>
				<Button onClick={(e) => removeSuggestion(sug)}>Remove</Button>
				<Button onClick={(e) => addCityAndStores(sug)}>Add City and Stores</Button>
			</ButtonGroup>
		);
	};

	return (
		<div>
			<h2>Suggestions</h2>
			{suggestions && (
				<Table>
					<thead>
						<tr>
							<th>State</th>
							<th>City</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{suggestions.map((sug, i) => {
							return (
								<tr>
									<td>{sug.state}</td>
									<td>{sug.city}</td>
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
