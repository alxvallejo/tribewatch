import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { ShopperContext } from '../context/ShopperContext';
import { Nav, Navbar, NavDropdown, Image, Modal, OverlayTrigger, Popover, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { LocationSelection } from './LocationSelection';
import { SuggestCity } from './SuggestCity';
import LinesEllipsis from 'react-lines-ellipsis';

import { firebaseAuth, firebaseDb } from '../services/firebase';

export const TopNav = () => {
	const [{ user, location, inbox }, userDispatch] = useContext(UserContext);
	const [{ shopEntries }, shopperDispatch] = useContext(ShopperContext);
	console.log('inbox at topNav: ', inbox);
	const [showLocationModal, setLocationModal] = useState();
	const [selectedState, setSelectedState] = useState();

	const listenForMessages = async () => {
		firebaseDb.ref(`messages/${location.collectionId}/`);
	};

	const handleLocationClose = (location) => {
		setLocationModal(null);
	};

	const setLocation = () => {
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

	const defaultNav = () => {
		return (
			<div>
				<div className="d-flex align-items-center">
					<a href="/" className="navbar-brand">
						<i className="fas fa-campground mr-2"></i>
						Tribewatch
					</a>
					<div>
						{location && (
							<h6 className="mb-0">
								{`${location.city}, ${location.state}`}
								<a role="button" onClick={() => setLocation()} className="ml-3">
									<i className="mr-2 fas fa-map-marker-alt"></i>Change Location
								</a>
							</h6>
						)}
					</div>
				</div>
			</div>
		);
	};

	const inboxOverlay = () => {
		const selectMsg = async (inboxMsg) => {
			console.log('inboxMsg: ', inboxMsg);
			const foundEntry = shopEntries.find((x) => x.uid === inboxMsg.entryUid);
			if (!foundEntry) {
				console.log('Could not find this entry!');
			} else {
				shopperDispatch({ type: 'SET_ENTRY', entry: foundEntry });
			}
			// const resp = await firebaseDb.ref(`shopping/${location.collectionId}/${inboxMsg.convoRef}`);
		};
		return (
			<Popover id="inbox-overlay">
				<Popover.Content>
					<h5>Recent Messages</h5>
					{inbox.map((inboxMsg, i) => {
						return (
							<div key={i} className="inbox-message" onClick={() => selectMsg(inboxMsg)}>
								<LinesEllipsis text={inboxMsg.lastMessage} className={inboxMsg.status} />
								<div className="byline">
									from <i>{inboxMsg.displayName}</i>
								</div>
							</div>
						);
					})}
				</Popover.Content>
			</Popover>
		);
	};

	const showInbox = () => {
		if (!inbox) {
			return null;
		}
		const inboxCount = inbox.filter((x) => x.status == 'unread').length;
		return (
			<OverlayTrigger trigger="click" key="inbox" placement="bottom" overlay={inboxOverlay()} rootClose={true}>
				<div>
					<i className="fas fa-inbox" />
					<Badge pill variant="secondary" className="inbox-count">
						{inboxCount}
					</Badge>
				</div>
			</OverlayTrigger>
		);
	};

	if (!user) {
		return (
			<Navbar expand="lg">
				<div className="container">
					{defaultNav()}
					<Nav className="mr-3">
						<a onClick={() => userDispatch({ type: 'SHOW_LOGIN', showLogin: true })}>Login</a>
					</Nav>
				</div>
			</Navbar>
		);
	} else {
		const { displayName, photoURL } = user;

		return (
			<Navbar expand="lg">
				<div className="container">
					{defaultNav()}
					<Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
					<Nav className="mr-3">
						{showInbox()}
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
