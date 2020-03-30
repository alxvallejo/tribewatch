import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { AdminContextProvider } from './context/AdminContext';

ReactDOM.render(
	<UserContextProvider>
		<AdminContextProvider>
			<App />
		</AdminContextProvider>
	</UserContextProvider>,
	document.getElementById('root')
);
