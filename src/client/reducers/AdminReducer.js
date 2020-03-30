import React, { useReducer } from 'react';

export const initialAdmin = {
	location: null,
	cities: null
};

export const AdminReducer = (state, action) => {
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

// export const [admin, dispatch] = useReducer(AdminReducer, initialAdmin);
