import React from 'react';
import {
	Container,
	Row,
	Col,
	Button,
	Form,
	Card,
	CardDeck,
	Modal,
	Badge,
	OverlayTrigger,
	Tooltip
} from 'react-bootstrap';

import { ItemStatuses, StoreItems, StoreItemsModal, TrafficStatuses } from '../StoreItems';

const moment = require('moment');

export const ItemStatusBadge = ({ item }) => {
	const status = ItemStatuses.find(x => x.name == item.status);
	const storeItem = StoreItems.find(x => x.name == item.item);
	if (!status) {
		return null;
	}
	const dateChecked = moment.unix(item.time).format('M/D h:m a');
	return (
		<OverlayTrigger
			placement="top"
			overlay={
				<Tooltip id={`${item.name}_${item.time}`}>
					{item.item}
					<br />
					{dateChecked} - {item.user}
				</Tooltip>
			}
		>
			<Badge variant={status.variant}>
				<i className={`mr-1 fas ${storeItem.icon}`} />
				{item.status}
			</Badge>
		</OverlayTrigger>
	);
};

export const TrafficStatusBadge = ({ store }) => {
	const { traffic } = store;
	if (!traffic) {
		return null;
	}
	const storeTrafficHoursAgo = traffic && moment.unix(traffic.time).diff(Date.now(), 'hours');

	if (storeTrafficHoursAgo > 2) {
		// Stale traffic report
		return null;
	}

	const trafficStatus = TrafficStatuses.find(x => x.name == traffic.status);
	const dateChecked = moment.unix(traffic.time).format('M/D h:m a');
	return (
		<OverlayTrigger
			placement="top"
			overlay={
				<Tooltip id={`${store.id}_traffic`}>
					{dateChecked} - {traffic.user}
				</Tooltip>
			}
		>
			<Badge variant={trafficStatus.variant}>
				<i className={`mr-1 fas fa-${trafficStatus.icon}`} />
				{trafficStatus.name}
			</Badge>
		</OverlayTrigger>
	);
};
