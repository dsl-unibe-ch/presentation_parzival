import { generateEntries } from '$lib/functions';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	let meta;
	try {
		const data = await import(`../../../../../../../lib/metadata-ms-page/${params.sigla}.json`);
		meta = data[params.sigla].find((/** @type {{ l: string, id:string | string[]; }} */ entry) =>
			entry.l.includes(`${params.thirties}.${params.verse.padStart(2, '0')}`)
		);
	} catch (e) {
		error(404, 'Not found');
	}
	return new Response(JSON.stringify({ iiif: meta.iiif, page: meta.id }));
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(true);
}
