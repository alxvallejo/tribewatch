import React, { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import { Header, Dimmer, Loader, Segment, Breadcrumb, Grid, Menu, Rail, List } from 'semantic-ui-react';

import { getProduct } from '../../services/shopify';
import AretaContext from '../../context/AretaContext';
import { SelectImagesModal } from './SelectImagesModal';
import { Loading } from '../Loading';

import { groupBy } from 'lodash';

export const ProductDetail = props => {
	const [product, setProduct] = useState(props.product);
	const [tab, setTab] = useState(0);
	const [match, setMatch] = useState(props.match);
	const options = useContext(AretaContext);

	useEffect(() => {
		const checkProps = async () => {
			const productId = match.params.id;
			if (!product && productId) {
				const newProduct = await getProduct(productId);
				setProduct(newProduct);
			}
		};
		checkProps();
	}, []);

	if (!product) {
		return <Loading />;
	}

	const variantsByColor = Object.entries(groupBy(product.variants, options.colorOption));

	const tabHeader = tabIndex => {
		const [color, variants] = variantsByColor[tab];
		return (
			<Segment>
				<Header as="h4">{color}</Header>
				<Rail position="right">
					<List>
						{variants.map((v, i) => (
							<List.Item key={i}>{v.title}</List.Item>
						))}
					</List>
				</Rail>
				<SelectImagesModal variants={variants} color={color} />
			</Segment>
		);
	};

	return (
		<div>
			<Segment textAlign="left" basic>
				<Breadcrumb>
					<Breadcrumb.Section>
						<Link to="/">Products</Link>
					</Breadcrumb.Section>
					<Breadcrumb.Divider />
					<Breadcrumb.Section active>{product.title}</Breadcrumb.Section>
				</Breadcrumb>
			</Segment>
			<Header>{product.title}</Header>
			<Grid>
				<Grid.Column width={4}>
					<Menu fluid vertical tabular>
						{variantsByColor.map(([color, variants], i) => {
							return <Menu.Item key={i} name={color} active={tab == i} onClick={() => setTab(i)} />;
						})}
					</Menu>
				</Grid.Column>

				<Grid.Column stretched width={12}>
					{tabHeader(tab)}
				</Grid.Column>
			</Grid>
		</div>
	);
};
