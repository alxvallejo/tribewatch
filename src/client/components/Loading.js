import React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';

export const Loading = () => {
	return (
		<Dimmer active>
			<Loader />
		</Dimmer>
	);
};
