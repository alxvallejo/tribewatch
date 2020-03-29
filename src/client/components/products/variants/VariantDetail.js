import React, { Component } from 'react';

import { Dimmer, Loader, Header, Breadcrumb, Segment, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { getProduct, getProductImages } from '../../../services/shopify';
import VariantImages from '../SelectImagesModal';

export default class VariantDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			product: props.location.state.product,
			variant: props.location.state.variant,
			images: null
		};
	}

	async componentDidMount() {
		let { product, variant } = this.state;
		const productId = this.props.match.params.productId;

		if (!product && productId) {
			try {
				product = await getProduct(productId);
				const variants = product.variants;
				variant = variants.find(x => x.id == this.props.match.params.id);
				this.setState({ product, variant });
			} catch (error) {
				throw new Error(error);
			}
		}
		const images = await getProductImages(productId);
		this.setState({ images });
	}

	async getProductImages(productId) {
		try {
			const response = await fetch('/api/listProductImages', { productId });
			const json = await response.json();
			this.setState({ images: json.images });
		} catch (error) {
			throw new Error(error);
		}
	}

	render() {
		const { images, product, variant } = this.state;

		if (!images || !product) {
			return (
				<Dimmer active>
					<Loader />
				</Dimmer>
			);
		}

		return (
			<div>
				<Segment textAlign="left" basic>
					<Breadcrumb>
						<Breadcrumb.Section>
							<Link to="/">Products</Link>
						</Breadcrumb.Section>
						<Breadcrumb.Divider />
						<Breadcrumb.Section>
							<Link to="`/products/${product.id}`">{product.title}</Link>
						</Breadcrumb.Section>
						<Breadcrumb.Divider />
						<Breadcrumb.Section active>{variant.title}</Breadcrumb.Section>
					</Breadcrumb>
				</Segment>
				<Header>{variant.title}</Header>
				<VariantImages images={images} variant={variant} />
			</div>
		);
	}
}
