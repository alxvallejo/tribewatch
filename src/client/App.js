/* eslint-disable no-tabs */
import React, { useState, useEffect, useContext } from 'react';
import './sass/globals.scss';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { ShopperContext } from './context/ShopperContext';
import { Modal } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { keys, map, orderBy } from 'lodash';

import { Login } from './components/Login';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { AdminDash } from './components/admin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Shopping } from './components/Shopping';
import { Message } from './components/shopping/Message';

import { firebaseAuth, firebaseDb } from './services/firebase';

const App = () => {
	const [{ user, location, showLogin }, userDispatch] = useContext(UserContext);
	const [{ entry }, shopperDispatch] = useContext(ShopperContext);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState();

	useEffect(() => {
		const checkUser = async () => {
			firebaseAuth.onAuthStateChanged(async (u) => {
				console.log('user on app load: ', u);
				if (u) {
					if (!user) {
						userDispatch({
							type: 'SET_USER',
							user: u,
						});
					}

					// Get user info
					const resp = await firebaseDb.ref(`users/${u.uid}`).once('value');
					const userInfo = resp.val();
					console.log('userInfo: ', userInfo);
					if (userInfo) {
						if (userInfo.location) {
							userDispatch({
								type: 'SET_LOCATION',
								location: userInfo.location,
							});
							// We need two listeners for messages
							// 1. Listen for messageSubscriptions on other entries
							// 2. Listen for messages on your entries
							if (u && userInfo.location) {
								// Check messageSubscriptions
								firebaseDb
									.ref(`messageInbox/${userInfo.location.collectionId}/${u.uid}`)
									.on('value', (snapshot) => {
										const results = snapshot.val();
										console.log('results: ', results);
										if (results) {
											// Filter the results.
											// If already on conversation,
											// delete the inbox notification
											let filteredInbox = keys(results).map((key) => {
												return {
													...results[key],
													key,
												};
											});

											filteredInbox = orderBy(filteredInbox, 'time', 'desc');

											if (entry) {
												// If the convo is already active, we can mark it as read
												// console.log('entry: ', entry);
												filteredInbox = filteredInbox.map((result, i) => {
													// console.log('result: ', result);
													if (result.entryUid === entry.uid) {
														return {
															...result,
															status: 'read',
														};
													} else {
														return result;
													}
												});
											}

											userDispatch({
												type: 'SET_INBOX',
												inbox: filteredInbox,
											});
										} else {
											userDispatch({
												type: 'SET_INBOX',
												inbox: null,
											});
										}
									});
							}
						}
						if (userInfo.preferences) {
							userDispatch({
								type: 'SET_PREFERENCES',
								preferences: userInfo.preferences,
							});
						}
						if (userInfo.profile) {
							userDispatch({
								type: 'SET_PROFILE',
								profile: userInfo.profile,
							});
						}
						if (userInfo.favorites) {
							userDispatch({
								type: 'SET_FAVORITES',
								favorites: userInfo.favorites,
							});
						}
						if (userInfo.seenTutorial) {
							userDispatch({
								type: 'SET_SEEN_TUTORIAL',
								seenTutorial: userInfo.seenTutorial,
							});
						}
					}
					await checkAdmin(u);
				}

				setLoading(false);
			});
		};
		if (!user) {
			checkUser();
		}
		const checkAdmin = async (u) => {
			if (!u) {
				return;
			}
			// Check admins
			const resp = await firebaseDb.ref(`admins`).orderByChild('uid').equalTo(u.uid).once('value');
			const adminObj = resp.val();
			if (adminObj) {
				setIsAdmin(true);
			}
		};
	}, [user]);

	if (loading) {
		return (
			<div className="loading">
				<div className="lds-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		);
	}

	const handleLoginClose = () => {
		userDispatch({ type: 'SHOW_LOGIN', showLogin: false });
	};

	return (
		<BrowserRouter>
			<TopNav />
			<Switch>
				<Route path="/privacy" component={PrivacyPolicy} />
				{isAdmin && <Route path="/admin" component={AdminDash} />}
				<Route path="/shopping-list" component={Shopping} />
				<Route path="/" component={Dashboard} />
			</Switch>
			<Footer />
			<Modal show={!!showLogin} onHide={handleLoginClose} centered>
				<Modal.Body>
					<Login handleClose={handleLoginClose} />
				</Modal.Body>
			</Modal>
			<Modal show={entry && user} onHide={() => shopperDispatch({ type: 'SET_ENTRY', entry: null })} centered>
				<Modal.Header closeButton>
					<Modal.Title>{`Chat with ${entry && entry.displayName}`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Message entry={entry} convoUid={user && user.uid} />
				</Modal.Body>
			</Modal>
		</BrowserRouter>
	);
};

export default App;
