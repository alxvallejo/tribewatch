import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Shoppers } from './shopping/Shoppers';
import { Redirect } from 'react-router-dom';

export const Shopping = () => {
	const [{ user, location }, userDispatch] = useContext(UserContext);

	return (
		<Container>
			<Shoppers />
		</Container>
	);
};
