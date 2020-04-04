import React from 'react';

import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

export const Footer = () => {
	return (
		<footer className="page-footer font-small blue pt-4">
			<div className="container-fluid text-center text-md-left">
				<div className="row">
					<div className="col-md-6 mt-md-0 mt-3">
						<h5 className="text-uppercase">Tribewatch</h5>
						<p>
							<a href="/privacy">Privacy Policy</a>
						</p>
					</div>
				</div>
			</div>
			<div className="footer-copyright text-center py-3">
				© 2020
				<a href="https://tribewatch.us"> Tribewatch</a>
			</div>
		</footer>
	);
};
