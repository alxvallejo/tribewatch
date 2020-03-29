import React, { useState } from 'react';

export const UserContext = React.createContext({
	user: null,
	setUser: () => {},
	location: null,
	setLocation: () => {}
});

export const UserContextProvider = props => {
	const setUser = user => {
		setState({ ...state, user });
	};

	const setLocation = location => {
		setState({ ...state, location });
	};

	const initState = {
		user: null,
		setUser: setUser,
		location: null,
		setLocation: setLocation
	};

	const [state, setState] = useState(initState);

	return <UserContext.Provider value={state}>{props.children}</UserContext.Provider>;
};
