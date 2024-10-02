import { api, teipb } from '$lib/constants';
import { generateEntries } from '$lib/functions';
import { JSDOM } from 'jsdom';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params, parent }) {
	/** @type {{ [key: string]: Promise<any> }} */
	const publisherData = {};
	console.log('einzelverssynopse', params);
	const rawPublisherData = await parent();
	const thirties = params.thirties ?? '1';
	const verse = params.verse?.padStart(2, '0') ?? '01';

	const sigla = await fetch(`${api}/json/metadata-nomenclature.json`).then((res) => res.json());

	// Fetch the textzeugen
	sigla.codices.forEach(async (/** @type {{ handle: string; }} */ element) => {
		const html = JSDOM.fragment((await rawPublisherData[element.handle]).content);
		console.log('created fragment');
		const line = html.querySelector(`span[data-verse="${thirties}.${verse}"]`);
		console.log('found line', line);
		if (line) {
			publisherData[element.handle] = line.outerHTML;
		}
	});
	// Fetch fassungen
	// sigla.hyparchetypes.forEach((/** @type {{ handle: string}} */ element) => {
	// 	publisherData[element.handle] = fetch(
	// 		`${teipb}/parts/syn${thirties}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element.handle}%20${thirties}.${verse}%27]`
	// 	).then((r) => r.json());
	// });

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
