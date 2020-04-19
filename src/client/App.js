/* eslint-disable no-tabs */
import React, { useState, useEffect, useContext } from 'react';
import './sass/globals.scss';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { AdminContextProvider } from './context/AdminContext';
import { Modal } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';

import { Login } from './components/Login';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { AdminDash } from './components/admin';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Shopping } from './components/Shopping';

import { firebaseAuth, firebaseDb } from './services/firebase';
import firebase from 'firebase';

const App = () => {
	const [{ user, location, showLogin }, userDispatch] = useContext(UserContext);
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
					if (userInfo) {
						if (userInfo.location) {
							userDispatch({
								type: 'SET_LOCATION',
								location: userInfo.location,
							});
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
		</BrowserRouter>
	);
};

export default App;
