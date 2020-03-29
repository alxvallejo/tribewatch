import React, { useState, useEffect, useContext } from 'react';
import { Segment, Card, Modal, Button, Icon, Header, Image } from 'semantic-ui-react';
import { Loading } from '../Loading';

import { getVariantMetafields, getProductImages, createVariantImages } from '../../services/shopify';
import AretaContext from '../../context/AretaContext';

/**
 * Select images for assigning to a color variant.
 * The images are saved as Shopfiy Metafields as type json_string and are replicated
 * for each variant in the set.
 *
 * @param {variants} props
 */
export const SelectImagesModal = props => {
	const [variants, setVariants] = useState(props.variants);
	const [color, setColor] = useState(props.color);
	const [variantMeta, setVariantMeta] = useState();
	const [images, setImages] = useState();
	const [selectedImages, setSelected] = useState([]);
	const options = useContext(AretaContext);
	const metafieldKey = color.replace(/\s+/g, '-').toLowerCase();

	useEffect(() => {
		const getVariantMeta = async () => {
			const mf = await getVariantMetafields(variants[0].id);
			setVariantMeta(mf);
		};
		const getImages = async () => {
			const imgs = await getProductImages(variants[0].product_id);
			setImages(imgs);
		};
		getVariantMeta();
		getImages();
	}, []);

	if (!images) {
		return <Loading />;
	}

	const handleSelect = id => {
		const selected = selectedImages.includes(id);
		const newSelected = selected ? selectedImages.filter(x => x !== id) : [...selectedImages, id];
		setSelected(newSelected);
	};

	const handleSave = () => {
		console.log('variants', variants);
		console.log('selectedImages', selectedImages);
	};

	return (
		<Modal trigger={<Button>Select Images</Button>}>
			<Modal.Header>Select Images for {color}</Modal.Header>
			<Modal.Content scrolling>
				<Modal.Description>
					<p>These images will be assigned to all variants with this color.</p>
				</Modal.Description>
				<Segment>
					<Card.Group itemsPerRow={6}>
						{images.map((img, i) => {
							const selected = selectedImages.includes(img.id);
							const checked = selected ? <Icon circular name="check" color="blue" /> : null;
							return (
								<Card
									key={i}
									onClick={() => {
										handleSelect(img.id);
									}}
								>
									<Image src={img.src} />
									<Card.Content extra>{checked}</Card.Content>
								</Card>
							);
						})}
					</Card.Group>
				</Segment>
			</Modal.Content>
			<Modal.Actions>
				<Button primary onClick={() => handleSave()}>
					Save <Icon name="chevron right" />
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
