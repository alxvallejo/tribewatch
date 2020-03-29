import React, { Component } from 'react';

import { Message } from 'semantic-ui-react';

const Error = ({ header }) => {
	if (!header) {
		return null;
	}
	console.log('header', header);
	return (
		<Message negative>
			<Message.Header>Test</Message.Header>
		</Message>
	);
};

export default Error;
