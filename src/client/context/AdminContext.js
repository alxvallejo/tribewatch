import React, { useState, useReducer } from 'react';

export const AdminContext = React.createContext();

const initialAdmin = {
	location: null,
	cities: null
};

const AdminReducer = (state, action) => {
	console.log('action: ', action);
	switch (action.type) {
		case 'SET_LOCATION':
			console.log('action', action);
			return {
				...state,
				location: action.location
			};

		case 'SET_CITIES':
			return {
				...state,
				cities: action.cities
			};

		default:
			return state;
	}
};

export const AdminContextProvider = props => {
	const [state, dispatch] = useReducer(AdminReducer, initialAdmin);

	return <AdminContext.Provider value={[state, dispatch]}>{props.children}</AdminContext.Provider>;
};
