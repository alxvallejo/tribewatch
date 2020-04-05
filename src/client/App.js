/* eslint-disable no-tabs */
import React, { useState, useEffect, useContext } from 'react';
import './sass/globals.scss';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { AdminContextProvider } from './context/AdminContext';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';

import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { AdminDash } from './components/admin';
import { PrivacyPolicy } from './components/PrivacyPolicy';

import { firebaseAuth, firebaseDb } from './services/firebase';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const App = props => {
	const [{ user }, userDispatch] = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState();

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
								profile: userInfo.profile
							});
						}
						if (userInfo.favorites) {
							userDispatch({
								type: 'SET_FAVORITES',
								favorites: userInfo.favorites
							});
						}
						if (userInfo.seenTutorial) {
							userDispatch({
								type: 'SET_SEEN_TUTORIAL',
								seenTutorial: userInfo.seenTutorial
							});
						}
					}
				}
				await checkAdmin(u);
				setLoading(false);
			});
		};
		if (!user) {
			checkUser();
		}
		const checkAdmin = async u => {
			if (!u) {
				return;
			}
			// Check admins
			const resp = await firebaseDb
				.ref(`admins`)
				.orderByChild('uid')
				.equalTo(u.uid)
				.once('value');
			const adminObj = resp.val();
			console.log('adminObj: ', adminObj);
			if (adminObj) {
				setIsAdmin(true);
			}
		};
	}, []);

	// Configure FirebaseUI.
	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: 'popup',
		// We will display Google and Facebook as auth providers.
		signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID],
		// firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID],
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

	const LoginForm = () => {
		return (
			<Container className="login">
				<div className="text-center mb-4">
					<div className="icons h2 mb-4">
						<i className="fas fa-pump-soap mr-4 pr-2"></i>
						<i className="fas fa-toilet-paper"></i>
						<i className="fas fa-thermometer-half ml-4 pl-2"></i>
					</div>
					<h2>
						Real-time reporting
						<br />
						of <em>essential items</em>
						<br />
						in your community.
					</h2>
					<div></div>
				</div>
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
			</Container>
		);
	};

	if (!user) {
		console.log('no user');
		return (
			<BrowserRouter>
				<TopNav />
				<Switch>
					<Route path="/privacy" component={PrivacyPolicy} />
					<Route path="/" component={LoginForm} />
				</Switch>
				<Footer />
			</BrowserRouter>
		);
	}

	// currently assumes admin
	return (
		<BrowserRouter>
			<TopNav />
			<Switch>
				<Route path="/privacy" component={PrivacyPolicy} />
				{isAdmin && <Route path="/admin" component={AdminDash} />}

				<Route path="/" component={Dashboard} />
			</Switch>
			<Footer />
		</BrowserRouter>
	);
};

export default App;
