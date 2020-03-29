import React, { useContext } from 'react';

import { UserContext } from '../../context/UserContext';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../services/firebase';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const AdminDash = () => {
	const state = useContext(UserContext);

	return <div>Admin Dashboard</div>;
};
