import React from 'react';

import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

export const Footer = () => {
	return (
		<footer id="footer">
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<a href="/" className="footer-logo">
							<i className="fas fa-campground mr-2"></i>Tribewatch
						</a>
					</div>
					<div className="col-md-6 right-col">
						<ul>
							<li>
								© 2020 <a href="/"> Tribewatch</a>
							</li>
							<li>
								<a href="/privacy">Privacy Policy</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};
