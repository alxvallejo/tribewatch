export const getStoresByLocation = async (location, term) => {
	try {
		const urlParams = new URLSearchParams({ location, term });
		const response = await fetch('/api/getStoresByLocation?' + urlParams);
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('error: ', error);
		// throw Error(error);
	}
};
