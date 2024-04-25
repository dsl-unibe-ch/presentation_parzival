import { generateEntries } from '$lib/functions';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const sigla = params.sigla.split('-');
	const meta = sigla.map((witnes) =>
		fetch(`/api/json/metadata-ms-page/${witnes}/${params.thirties}/${params.verse}`).then((r) => {
			if (r.status === 200) {
				return r.json();
			} else {
				return { iiif: '', page: '' };
			}
		})
	);
	return {
		sigla,
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0'),
		iiif: (await Promise.all(meta)).map((m) => m.iiif),
		page: (await Promise.all(meta)).map((m) => m.page)
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// @ts-ignore
	return generateEntries(true);
}
