import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { firebaseApp, firebaseAuth } from '../services/firebase';

export const TopNav = () => {
	const [{ user }, userDispatch] = useContext(UserContext);

	const signOut = () => {
		firebaseAuth
			.signOut()
			.then(() => {
				localStorage.removeItem('authUser');
				userDispatch({
					type: 'SET_USER',
					user: null
				});
			})
			.catch(e => {
				console.log('e: ', e);
			});
	};

	if (!user) {
		return (
			<Navbar expand="lg">
				<Navbar.Brand>Tribewatch</Navbar.Brand>
			</Navbar>
		);
	} else {
		const { displayName, photoURL } = user;
		console.log('displayName: ', displayName);
		console.log('photoURL: ', photoURL);
		console.log('user: ', user);

		return (
			<Navbar expand="lg">
				<Navbar.Brand>Tribewatch</Navbar.Brand>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">{/* <Nav.Link href="#home">Home</Nav.Link> */}</Nav>
					<NavDropdown title={<Image rounded src={photoURL} />} id="basic-nav-dropdown">
						<NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
						<NavDropdown.Item onClick={() => signOut()}>Logout</NavDropdown.Item>
					</NavDropdown>
				</Navbar.Collapse>
			</Navbar>
		);
	}
};
