import { generateEntries } from '$lib/functions';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const sigla = params.sigla.split('-');
	const iiif = sigla.map((witnes) =>
		fetch(`/api/json/metadata-ms-page/${witnes}/${params.thirties}/${params.verse}`)
			.then((r) => r.json())
			.then((data) => data.iiif)
	);
	return {
		sigla,
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0'),
		iiif: await Promise.all(iiif)
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// @ts-ignore
	return generateEntries(true);
}
