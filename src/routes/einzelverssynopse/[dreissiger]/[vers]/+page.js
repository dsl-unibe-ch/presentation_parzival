/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		dreissiger: params.dreissiger,
		vers: params.vers.padStart(2, '0')
	};
}
