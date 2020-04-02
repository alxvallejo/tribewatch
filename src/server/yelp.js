const fetch = require('node-fetch');

// Read from .env
require('dotenv').config();

if (!process.env.YELP_APIKEY) {
	throw Error('You must set a YELP_APIKEY in your environment variables');
}

const yelpApiKey = process.env.YELP_APIKEY;

const headers = {
	Authorization: 'Bearer ' + yelpApiKey,
	'Content-Type': 'application/json'
};

exports.getStoresByLocation = async (location, term) => {
	try {
		const limit = 50;
		const urlParams = new URLSearchParams({ term, location, limit });
		const url = 'https://api.yelp.com/v3/businesses/search?' + urlParams;
		const response = await fetch(url, { headers });
		const json = await response.json();
		const businesses = json.businesses;
		return businesses;
	} catch (error) {
		throw Error(error);
	}
};
