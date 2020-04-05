import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { firebaseAuth } from '../services/firebase';

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
				<div className="container">
					<Navbar.Brand>
						<i className="fas fa-campground mr-2"></i>
						Tribewatch
					</Navbar.Brand>
				</div>
			</Navbar>
		);
	} else {
		const { displayName, photoURL } = user;

		return (
			<Navbar expand="lg">
				<div className="container">
					<a href="/" className="navbar-brand">
						<i className="fas fa-campground mr-2"></i>
						Tribewatch
					</a>
					<Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
					<Nav className="mr-auto">{/* <Nav.Link href="#home">Home</Nav.Link> */}</Nav>
					<NavDropdown title={<Image src={photoURL} className="img-thumbnail" />} id="basic-nav-dropdown">
						<NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
						<NavDropdown.Item onClick={() => signOut()}>Logout</NavDropdown.Item>
					</NavDropdown>
				</div>
			</Navbar>
		);
	}
};
