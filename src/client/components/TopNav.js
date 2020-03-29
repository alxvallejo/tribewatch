import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { firebaseApp, firebaseAuth } from '../services/firebase';

export const TopNav = () => {
	const state = useContext(UserContext);
	console.log('state: ', state);

	const signOut = () => {
		firebaseAuth
			.signOut()
			.then(() => {
				localStorage.removeItem('authUser');
				state.setUser(null);
			})
			.catch(e => {
				console.log('e: ', e);
			});
	};

	if (!state.user) {
		return (
			<Navbar expand="lg">
				<Navbar.Brand>Tribewatch</Navbar.Brand>
			</Navbar>
		);
	} else {
		const { user } = state;
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
						<Link to="/admin">Admin</Link>
						<NavDropdown.Item onClick={() => signOut()}>Logout</NavDropdown.Item>
					</NavDropdown>
				</Navbar.Collapse>
			</Navbar>
		);
	}
};
