/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		dreissiger: params.dreissiger,
		vers: params.vers.padStart(2, '0')
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// Generate all 827 Dreissiger with 1-30 verses
	/** @type {import('./$types').RouteParams[]} */
	const entryArray = [];
	for (let dreissiger = 1; dreissiger <= 827; dreissiger++) {
		for (let vers = 1; vers <= 30; vers++) {
			entryArray.push({
				dreissiger: `${dreissiger}`,
				vers: `${vers}`
			});
		}
	}

	return entryArray;
}
