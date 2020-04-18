import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Shoppers } from './shopping/Shoppers';

export const Shopping = () => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const { city, state } = location;

	return (
		<Container>
			<Shoppers />
		</Container>
	);
};
