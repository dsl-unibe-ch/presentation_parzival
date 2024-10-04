import { api } from '$lib/constants';
import { generateEntries } from '$lib/functions';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	console.log(params);
	/** @type {{ [key: string]: Promise<any> }} */
	/*const publisherData = {};

	sigla.codices.forEach((element) => {
		publisherData[element.handle] = fetch(
			`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${params.thirties}.${params.verse.padStart(2, '0')}%27]`
		).then((r) => r.json());
	});*/

	return {
		thirties: params.thirties ?? '1',
		verse: params.verse?.padStart(2, '0') ?? '01',
		sigla: await fetch(`${api}/json/metadata-nomenclature.json`).then((res) => res.json())
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(false);
}
