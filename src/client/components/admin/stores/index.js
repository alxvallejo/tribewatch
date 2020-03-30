import React, { useContext } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

export const Stores = () => {
	const [admin, adminDispatch] = useContext(AdminContext);

	if (!admin.city) {
		return 'Select a city to view stores.';
	}
	return <div></div>;
};
