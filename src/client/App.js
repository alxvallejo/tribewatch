/* eslint-disable no-tabs */
import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { AdminContextProvider } from './context/AdminContext';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';

import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { AdminDash } from './components/admin';

import { firebaseAuth, firebaseDb } from './services/firebase';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const App = props => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUser = async () => {
			firebaseAuth.onAuthStateChanged(async u => {
				console.log('user on app load: ', u);
				if (u) {
					userDispatch({
						type: 'SET_USER',
						user: u
					});
					// Get user info
					const resp = await firebaseDb.ref(`users/${u.uid}`).once('value');
					const userInfo = resp.val();
					console.log('userInfo: ', userInfo);
					if (userInfo) {
						if (userInfo.location) {
							userDispatch({
								type: 'SET_LOCATION',
								location: userInfo.location
							});
						}
						if (userInfo.preferences) {
							userDispatch({
								type: 'SET_PREFERENCES',
								preferences: userInfo.preferences
							});
						}
						if (userInfo.profile) {
							userDispatch({
								type: 'SET_PROFILE',
								location: userInfo.profile
							});
						}
					}

					setLoading(false);
				}
			});
		};
		if (!user) {
			checkUser();
		}
	}, []);

	// Configure FirebaseUI.
	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: 'popup',
		// We will display Google and Facebook as auth providers.
		signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID],
		callbacks: {
			// Avoid redirects after sign-in.
			signInSuccessWithAuthResult: (authResult, redirectUrl) => {
				console.log('authResult', authResult);
				if (authResult.user) {
					userDispatch({
						type: 'SET_USER',
						user: authResult.user
					});
					localStorage.setItem('authUser', JSON.stringify(authResult.user));
				}
				false;
			}
		}
	};

	if (loading) {
		return 'Loading...';
	}

	if (!user) {
		console.log('no user');
		return (
			<BrowserRouter>
				<Container>
					<TopNav />
					<Col>
						Tribewatch is designed to help communities address needs in an efficient, trustworthy manner.
						<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
					</Col>
				</Container>
			</BrowserRouter>
		);
	}

	// currently assumes admin
	return (
		<BrowserRouter>
			<Container>
				<TopNav />
				<Switch>
					<Route path="/admin" component={AdminDash} />
					<Route path="/" component={Dashboard} />
				</Switch>
			</Container>
		</BrowserRouter>
	);
};

export default App;
