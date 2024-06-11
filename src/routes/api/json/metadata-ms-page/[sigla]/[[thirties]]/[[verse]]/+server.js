import { error } from '@sveltejs/kit';
import { api } from '$lib/constants';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	let meta;
	const thirties = params.thirties ?? '1';
	const verse = params.verse?.padStart(2, '0') ?? '01';
	try {
		const data = await fetch(`${api}/json/metadata-ms-page/${params.sigla}.json`).then((r) =>
			r.json()
		);
		meta = data[params.sigla].find((/** @type {{ l: string, id:string | string[]; }} */ entry) =>
			entry.l.includes(`${thirties}.${verse}`)
		);
		return new Response(JSON.stringify({ iiif: meta.iiif, page: meta.id }));
	} catch (e) {
		return error(404, 'Not found');
	}
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(true);
}
