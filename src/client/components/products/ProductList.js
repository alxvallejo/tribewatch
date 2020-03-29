/* eslint-disable no-tabs */
import React, { useState, useEffect, useContext } from 'react';
import { Breadcrumb, Table, Loader, Dimmer, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { sortBy, reverse } from 'lodash';
import { Loading } from '../Loading';

const moment = require('moment');

export const ProductList = props => {
	const [products, setProducts] = useState();
	const [match, setMatch] = useState(props.match);

	useEffect(() => {
		const checkProps = async () => {
			listProducts();
		};
		checkProps();
	}, []);

	const listProducts = async () => {
		try {
			const response = await fetch('/api/listProducts');
			const json = await response.json();
			const sortedProducts = sortBy(json.products, p => {
				const updatedUnix = moment(p.updated_at).unix();
				return updatedUnix;
			});
			console.log('sortedProducts: ', sortedProducts);
			setProducts(reverse(sortedProducts));
		} catch (error) {
			console.log('error: ', error);
			// throw new Error(error);
		}
	};

	if (!products) {
		return <Loading />;
	}

	const productRow = product => {
		const updatedDate = moment(product.updated_at).format('MMM D, YYYY hh:mm a');
		return (
			<Table.Row key={product.id}>
				<Table.Cell>
					<Link
						to={{
							pathname: `/products/${product.id}`
						}}
						params={product}
					>
						{product.title}
					</Link>
				</Table.Cell>
				<Table.Cell>{updatedDate}</Table.Cell>
			</Table.Row>
		);
	};

	const productTable = () => {
		return (
			<div>
				<Segment textAlign="left" basic>
					<Breadcrumb>
						<Breadcrumb.Section>Products</Breadcrumb.Section>
					</Breadcrumb>
				</Segment>

				<Table celled striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Products</Table.HeaderCell>
							<Table.HeaderCell>Last Updated</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{products.map(product => {
							return productRow(product);
						})}
					</Table.Body>
				</Table>
			</div>
		);
	};

	return <div>{productTable()}</div>;
};
