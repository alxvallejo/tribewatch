import React, { useContext, useEffect, useState } from 'react';
import { firebaseDb } from '../../../services/firebase';
import { AdminContext } from '../../../context/AdminContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

export const Stores = () => {
	const [{ cities, city }, adminDispatch] = useContext(AdminContext);
	console.log('city: ', city);

	if (!city) {
		return 'Select a city to view stores.';
	}

	// const collection

	// useEffect(() => {
	// 	const getStores = async () => {
	// 		const resp = await firebaseDb.ref(`stores/`)
	// 	}
	// }, [])
	return <div></div>;
};
