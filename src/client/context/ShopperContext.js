import React, { useReducer } from 'react';

export const ShopperContext = React.createContext();

const initialShopper = {
	shopEntries: null,
	entry: null,
};

const ShopperReducer = (state, action) => {
	switch (action.type) {
		case 'SET_SHOPPER_ENTRIES':
			return {
				...state,
				shopEntries: action.shopEntries,
			};

		// Set an entry for showing message modal.
		// If the entry.uid does not match the current message uid,
		// Show an inbox notification
		case 'SET_ENTRY':
			return {
				...state,
				entry: action.entry,
			};

		default:
			return state;
	}
};

export const ShopperContextProvider = (props) => {
	const [state, dispatch] = useReducer(ShopperReducer, initialShopper);

	return <ShopperContext.Provider value={[state, dispatch]}>{props.children}</ShopperContext.Provider>;
};
