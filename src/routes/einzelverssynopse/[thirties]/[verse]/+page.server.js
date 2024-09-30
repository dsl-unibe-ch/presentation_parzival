import { api, teipb } from '$lib/constants';
import { generateEntries } from '$lib/functions';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};
	console.log('einzelverssynopse', params);

	const thirties = params.thirties ?? '1';
	const verse = params.verse?.padStart(2, '0') ?? '01';

	const sigla = await fetch(`${api}/json/metadata-nomenclature.json`).then((res) => res.json());

	// Fetch the textzeugen
	sigla.codices.forEach((/** @type {{ handle: string; }} */ element) => {
		publisherData[element.handle] = fetch(
			`${teipb}/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${thirties}.${verse}%27]`
		).then((r) => r.json());
	});

	// Fetch fassungen
	sigla.hyparchetypes.forEach((/** @type {{ handle: string}} */ element) => {
		publisherData[element.handle] = fetch(
			`${teipb}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element.handle}%20${thirties}.${verse}%27]`
		).then((r) => r.json());
	});

	await Promise.allSettled(Object.values(publisherData));

	return {
		thirties,
		verse,
		sigla,
		publisherData
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// @ts-ignore
	return generateEntries(false);
}
