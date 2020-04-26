import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { UserContextProvider } from './context/UserContext';
import { AdminContextProvider } from './context/AdminContext';
import { ShopperContextProvider } from './context/ShopperContext';

ReactDOM.render(
	<UserContextProvider>
		<AdminContextProvider>
			<ShopperContextProvider>
				<App />
			</ShopperContextProvider>
		</AdminContextProvider>
	</UserContextProvider>,
	document.getElementById('root')
);
