/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0')
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// Generate all 827 Dreissiger with 1-30 verses
	/** @type {import('./$types').RouteParams[]} */
	const entryArray = [];
	/*for (let thirties = 1; thirties <= 827; thirties++) {
		for (let verse = 1; verse <= 30; verse++) {
			entryArray.push({
				thirties: `${thirties}`,
				verse: `${verse}`
			});
		}
	}*/
	// too many open files :(
	for (let thirties = 1; thirties <= 2; thirties++) {
		for (let verse = 1; verse <= 30; verse++) {
			entryArray.push({
				thirties: `${thirties}`,
				verse: `${verse}`
			});
		}
	}

	return entryArray;
}
