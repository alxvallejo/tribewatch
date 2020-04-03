import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button, ButtonGroup, Form, Modal } from 'react-bootstrap';
import Card, { CardBody } from 'react-bootstrap/Card';

export const ItemStatuses = [
	{
		name: 'Out',
		class: 'out',
		variant: 'light'
	},
	{
		name: 'Running Low',
		class: 'running-low',
		variant: 'warning'
	},
	{
		name: 'Plenty',
		class: 'plenty',
		variant: 'success'
	}
];

export const StoreItems = [
	{
		id: 'toilet-paper',
		name: 'Toilet Paper',
		icon: 'fa-toilet-paper'
	},
	{
		id: 'paper-towels',
		name: 'Paper Towels',
		icon: 'fa-toilet-paper'
	},
	{
		id: 'hand-sanitizer',
		name: 'Hand Sanitizer',
		icon: 'fa-pump-soap'
	},
	{
		id: 'tissues',
		name: 'Tissues',
		icon: 'fa-box-tissue'
	},
	{
		id: 'thermometer',
		name: 'Thermometer',
		icon: 'fa-thermometer'
	}
];

export const StoreItemsModal = ({ store, setItemStatus }) => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	console.log('user: ', user);
	const { city, state } = location;

	const checkStatus = id => {
		if (store.items && store.items[id]) {
			return store.items[id].status;
		}
		return null;
	};

	const showItem = (item, i) => {
		const itemStatus = checkStatus(item.id);
		return (
			<Card border="info" key={i}>
				<Card.Header>
					<h4>
						<i className={`mr-3 fas ${item.icon}`} />
						{item.name}
					</h4>
				</Card.Header>
				<Card.Body>
					<ButtonGroup>
						{ItemStatuses.map((s, i) => {
							const variantName = itemStatus && itemStatus == s.name ? s.variant : 'outline-secondary';
							return (
								<Button key={i} variant={variantName} onClick={e => setItemStatus(s, item)}>
									{s.name}
								</Button>
							);
						})}
					</ButtonGroup>
				</Card.Body>
			</Card>
		);
	};

	return (
		<div>
			{StoreItems.map((item, i) => {
				return showItem(item, i);
			})}
		</div>
	);
};
