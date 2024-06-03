import { generateEntries } from '$lib/functions';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	let meta;
	try {
		const data = await fetch(
			`https://dhbern.github.io/parzival-static-api/api/json/metadata-ms-page/${params.sigla}.json`
		).then((r) => r.json());
		meta = data[params.sigla].find((/** @type {{ l: string, id:string | string[]; }} */ entry) =>
			entry.l.includes(`${params.thirties}.${params.verse.padStart(2, '0')}`)
		);
		return new Response(JSON.stringify({ iiif: meta.iiif, page: meta.id }));
	} catch (e) {
		console.error(e);
		return error(404, 'Not found');
	}
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(true);
}
