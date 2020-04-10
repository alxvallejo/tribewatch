/* eslint-disable no-tabs */
const express = require('express');
const os = require('os');

const app = express();
const path = require('path');

var _ = require('lodash');

const yelp = require('./yelp');

app.use(express.static('dist'));
app.use(express.json());

app.get('/api/getStoresByLocation', async (req, res) => {
	try {
		const { location } = req.query;
		const groceryStores = await yelp.getStoresByLocation(location, 'grocery');
		const pharmacyStores = await yelp.getStoresByLocation(location, 'pharmacy');
		const stores = _.concat(groceryStores, pharmacyStores);
		res.send({ stores });
	} catch (error) {
		// console.log('error: ', error);
		throw Error(error);
	}
});

const root_path = path.join(__dirname, '../../public/index.html');
// console.log('root_path', root_path);
app.get('/*', (req, res) => res.sendFile(root_path));

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
