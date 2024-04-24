import { generateEntries } from '$lib/functions';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	return {
		sigla: params.sigla.split('-'),
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0'),
		iiif: (
			await fetch(
				`/api/json/metadata-ms-page/${params.sigla}/${params.thirties}/${params.verse}`
			).then((r) => r.json())
		).iiif
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// @ts-ignore
	return generateEntries(true);
}
