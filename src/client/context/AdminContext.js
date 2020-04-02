import React, { useState, useReducer } from 'react';

export const AdminContext = React.createContext();

const initialAdmin = {
	selectedState: null,
	city: null,
	cities: null,
	storeList: null
};

const AdminReducer = (state, action) => {
	switch (action.type) {
		case 'SET_SELECTED_STATE':
			return {
				...state,
				selectedState: action.selectedState
			};

		case 'SET_CITIES':
			return {
				...state,
				cities: action.cities
			};

		case 'SET_CITY':
			return {
				...state,
				city: action.city
			};

		case 'SET_STORE_LIST':
			return {
				...state,
				storeList: action.storeList
			};

		default:
			return state;
	}
};

export const AdminContextProvider = props => {
	const [state, dispatch] = useReducer(AdminReducer, initialAdmin);

	return <AdminContext.Provider value={[state, dispatch]}>{props.children}</AdminContext.Provider>;
};
