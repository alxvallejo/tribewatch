import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Shoppers = () => {
	const { entry, setEntry } = useState();

	return (
		<div>
			<h3>Shoppers</h3>
			<div>
				<ReactQuill theme="snow" value={entry} onChange={setEntry} />
			</div>
		</div>
	);
};
