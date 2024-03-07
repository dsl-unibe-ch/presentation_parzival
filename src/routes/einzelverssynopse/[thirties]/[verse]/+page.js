import sigla from '$lib/sigla.json';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};

	sigla.codices.forEach((element) => {
		publisherData[element.handle] = fetch(
			`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${params.thirties}.${params.verse.padStart(2, '0')}%27]`
		).then((r) => r.json());
	});

	return {
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0'),
		publisherData
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// Generate all 827 Dreissiger with 1-30 verses
	/** @type {import('./$types').RouteParams[]} */
	const entryArray = [];
	for (let thirties = 1; thirties <= 827; thirties++) {
		for (let verse = 1; verse <= 30; verse++) {
			entryArray.push({
				thirties: `${thirties}`,
				verse: `${verse}`
			});
		}
	}

	return entryArray;
}
