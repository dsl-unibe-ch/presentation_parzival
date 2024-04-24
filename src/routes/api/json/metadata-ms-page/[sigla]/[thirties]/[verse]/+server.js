import { generateEntries } from '$lib/functions';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	let iiif;
	try {
		const data = await import(`../../../../../../../lib/metadata-ms-page/${params.sigla}.json`);
		iiif = data[params.sigla].find((/** @type {{ l: string | string[]; }} */ entry) =>
			entry.l.includes(`${params.thirties}.${params.verse.padStart(2, '0')}`)
		)?.iiif;
	} catch (e) {
		error(404, 'Not found');
	}
	return new Response(iiif);
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(true);
}
