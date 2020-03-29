import React, { useContext } from 'react';

import { UserContext } from '../../context/UserContext';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../services/firebase';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const AdminDash = () => {
	const state = useContext(UserContext);

	return (
		<Container>
			<h2>Admin Dashboard</h2>
		</Container>
	);
};
