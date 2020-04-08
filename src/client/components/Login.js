import React, { useContext, useState } from 'react';
import { firebaseAuth, firebaseDb } from '../services/firebase';
import firebase from 'firebase';
import { UserContext } from '../context/UserContext';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Container, Button, Form, Card, Modal } from 'react-bootstrap';

const moment = require('moment');

export const Login = ({ handleClose }) => {
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
				// console.log('authResult', authResult);
				if (authResult.user) {
					userDispatch({
						type: 'SET_USER',
						user: authResult.user,
					});
					localStorage.setItem('authUser', JSON.stringify(authResult.user));
				}
				handleClose();
				return true;
			},
		},
	};

	return (
		<Container className="login">
			<div className="text-center mb-4">
				<h2>Tribewatch Login</h2>
				<p>This is just to make sure you're not a mutant.</p>
			</div>
			<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
		</Container>
	);
};
