import React, { useState, useReducer } from 'react';

export const UserContext = React.createContext();

const initialUser = {
	user: null,
	location: null,
	preferences: null,
	profile: null,
	storeList: null,
	favorites: [],
	tutorial: null,
	featuredStores: null,
	showLogin: false,
	inbox: null,
};

const UserReducer = (state, action) => {
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				user: action.user,
			};

		case 'SET_LOCATION':
			return {
				...state,
				location: action.location,
			};

		case 'SET_PREFERENCES':
			return {
				...state,
				preferences: action.preferences,
			};

		case 'SET_PROFILE':
			return {
				...state,
				profile: action.profile,
			};

		case 'SET_STORE_LIST':
			return {
				...state,
				storeList: action.storeList,
			};

		case 'SET_FAVORITES':
			return {
				...state,
				favorites: action.favorites,
			};

		case 'SET_TUTORIAL':
			return {
				...state,
				tutorial: action.tutorial,
			};

		case 'SET_FEATURED_STORES':
			return {
				...state,
				featuredStores: action.featuredStores,
			};

		case 'SHOW_LOGIN':
			return {
				...state,
				showLogin: action.showLogin,
			};

		// This is essentially a list of
		//
		case 'SET_INBOX':
			return {
				...state,
				inbox: action.inbox,
			};

		default:
			return state;
	}
};

export const UserContextProvider = (props) => {
	const [state, dispatch] = useReducer(UserReducer, initialUser);

	return <UserContext.Provider value={[state, dispatch]}>{props.children}</UserContext.Provider>;
};
