import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Nav, Navbar, NavDropdown, Image, Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { LocationSelection } from './LocationSelection';
import { SuggestCity } from './SuggestCity';

import { firebaseAuth } from '../services/firebase';

export const TopNav = () => {
	const [{ user, location }, userDispatch] = useContext(UserContext);
	const [showLocationModal, setLocationModal] = useState();
	const [selectedState, setSelectedState] = useState();

	const handleLocationClose = (location) => {
		setLocationModal(null);
	};

	const setLocation = (e) => {
		e.preventDefault();
		setLocationModal(true);
	};

	const signOut = () => {
		firebaseAuth
			.signOut()
			.then(() => {
				localStorage.removeItem('authUser');
				userDispatch({
					type: 'SET_USER',
					user: null,
				});
			})
			.catch((e) => {
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
					<div className="d-flex align-items-center">
						<a href="/" className="navbar-brand">
							<i className="fas fa-campground mr-2"></i>
							Tribewatch
						</a>
						<div>
							{location && (
								<h6 className="mb-0">
									{`${location.city}, ${location.state}`}
									<a role="button" onClick={setLocation} className="ml-3">
										<i className="mr-2 fas fa-map-marker-alt"></i>Change Location
									</a>
								</h6>
							)}
						</div>
					</div>

					<Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
					<Nav className="mr-3">
						<NavLink exact to="/" activeClassName="active" className="ml-4">
							<h6>Stores</h6>
						</NavLink>
						<NavLink to="/shopping-list" activeClassName="active" className="ml-4">
							<h6>Shopping</h6>
						</NavLink>
					</Nav>
					<NavDropdown title={<Image src={photoURL} className="img-thumbnail" />} id="basic-nav-dropdown">
						<NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
						<NavDropdown.Item onClick={() => signOut()}>Logout</NavDropdown.Item>
					</NavDropdown>
				</div>
				{showLocationModal && (
					<Modal show={!!showLocationModal} onHide={handleLocationClose} centered>
						<Modal.Header closeButton>
							<Modal.Title>Change Location</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<LocationSelection
								handleClose={handleLocationClose}
								onSelectState={(state) => setSelectedState(state)}
							/>
							{selectedState && (
								<div>
									<SuggestCity state={selectedState} />
								</div>
							)}
						</Modal.Body>
					</Modal>
				)}
			</Navbar>
		);
	}
};
