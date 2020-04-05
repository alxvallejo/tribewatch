import React, { useContext, useEffect } from 'react';

import { UserContext } from '../../../context/UserContext';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Card, Tab, Nav, Form } from 'react-bootstrap';
import { firebaseDb } from '../../../services/firebase';

export const Users = () => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const setAdmin = () => {
		firebaseDb.ref(`admins`).push({
			uid: user.uid,
			name: user.displayName
		});
	};
	const search = async e => {
		const term = e.target.value;
		const resp = await firebaseDb.ref(`users`).orderByChild('');
	};
	return (
		<div>
			<h2>Users</h2>
		</div>
	);
};
