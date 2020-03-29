import { UserContextProvider, UserContext } from '../context/UserContext';

const reverse = require('reverse-geocode');

export const getLocation = async () => {
	const success = position => {
		console.log('position: ', position);
		const lat = position.coords.latitude;
		const long = position.coords.longitude;

		const location = reverse.lookup(lat, long, 'us');

		return location;
	};

	const error = () => {
		console.log('unable to retrieve location');
	};

	if (!navigator.geolocation) {
		console.log('geolocation not supported');
	} else {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(success, error);
		});
	}
};
