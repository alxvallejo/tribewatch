import React, { useEffect, useContext, useState } from 'react';
import { firebaseDb } from '../../services/firebase';
import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Button, Badge, ButtonGroup, Form, Modal } from 'react-bootstrap';
import Card, { CardBody } from 'react-bootstrap/Card';
const sheetsIcon = require('./sheets.png');
const diaperIcon = require('./diaper.png');

export const TrafficStatuses = [
	{
		name: 'Empty',
		class: 'empty',
		variant: 'success',
		icon: 'user',
	},
	{
		name: 'Normal',
		class: 'normal',
		variant: 'success',
		icon: 'user',
	},
	{
		name: 'Busy',
		class: 'busy',
		variant: 'warning',
		icon: 'user-friends',
	},
	{
		name: 'Long Line',
		class: 'long-line',
		variant: 'danger',
		icon: 'users',
	},
];

export const ItemStatuses = [
	{
		name: 'Out',
		class: 'out',
		variant: 'danger',
	},
	{
		name: 'Running Low',
		class: 'running-low',
		variant: 'warning',
	},
	{
		name: 'Plenty',
		class: 'plenty',
		variant: 'success',
	},
];

export const StoreItems = [
	{
		id: 'toilet-paper',
		name: 'Toilet Paper',
		icon: 'fa-toilet-paper',
	},
	{
		id: 'paper-towels',
		name: 'Paper Towels',
		icon: 'fa-toilet-paper',
	},
	{
		id: 'disinfectant-wipes',
		name: 'Disinfectant Wipes',
		img: sheetsIcon,
	},
	{
		id: 'hand-sanitizer',
		name: 'Hand Sanitizer',
		icon: 'fa-pump-soap',
	},
	{
		id: 'tissues',
		name: 'Tissues',
		icon: 'fa-box-tissue',
	},
	{
		id: 'thermometer',
		name: 'Thermometer',
		icon: 'fa-thermometer-half',
	},
	{
		id: 'diapers',
		name: 'Diapers',
		img: diaperIcon,
	},
];

export const StoreItemsFilter = ({ itemFilters, setItemFilter }) => {
	return (
		<div className="filters">
			{StoreItems.map((item, i) => {
				const variant =
					itemFilters && itemFilters.includes(item.id) ? 'primary badge-pill' : 'outline-primary badge-pill';
				return (
					<Badge key={i} onClick={(e) => setItemFilter(item)} variant={variant}>
						{item.name}
					</Badge>
				);
			})}
		</div>
	);
};

export const StoreItemsModal = ({ store, setItemStatus, setTrafficStatus }) => {
	const [{ user, location, preferences, profile, storeList }, userDispatch] = useContext(UserContext);
	const { city, state } = location;

	const checkStatus = (id) => {
		if (store.items && store.items[id]) {
			return store.items[id].status;
		}
		return null;
	};

	const showItem = (item, i) => {
		console.log('item: ', item);
		const itemStatus = checkStatus(item.id);
		return (
			<Card key={i} className="modal-card">
				<Card.Header>
					<h3>
						{item.icon && <i className={`mr-3 fas ${item.icon} ${item.id}`} />}
						{item.img && <img src={item.img} style={{ width: 17 }} className="mr-3" />}
						{item.name}
					</h3>
				</Card.Header>
				<Card.Body>
					<ButtonGroup>
						{ItemStatuses.map((s, i) => {
							const variantName = itemStatus && itemStatus == s.name ? s.variant : 'outline-dark';
							return (
								<Button key={i} variant={variantName} onClick={(e) => setItemStatus(s, item)}>
									{s.name}
								</Button>
							);
						})}
					</ButtonGroup>
				</Card.Body>
			</Card>
		);
	};

	const trafficCard = () => {
		return (
			<Card className="modal-card">
				<Card.Header>
					<h3>
						<i className="mr-3 fas fa-users"></i>
						Traffic
					</h3>
				</Card.Header>
				<Card.Body>
					<ButtonGroup>
						{TrafficStatuses.map((s, index) => {
							const variantName =
								store.traffic && store.traffic.status == s.name ? s.variant : 'outline-dark';
							return (
								<Button key={index} variant={variantName} onClick={(e) => setTrafficStatus(s)}>
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
			{trafficCard()}
			{StoreItems.map((item, i) => {
				return showItem(item, i);
			})}
		</div>
	);
};
