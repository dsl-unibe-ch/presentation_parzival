import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	let iiif;
	try {
		const data = await import(`../../../../../../../lib/metadata-ms-page/${params.sigla}.json`);
		iiif = data[params.sigla].find((entry) =>
			entry.l.includes(`${params.thirties}.${params.verse.padStart(2, '0')}`)
		)?.iiif;
	} catch (e) {
		error(404, 'Not found');
	}
	return new Response(iiif);
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// Generate all 827 Dreissiger with 1-30 verses
	/** @type {import('./$types').RouteParams[]} */
	const entryArray = [];
	for (let thirties = 1; thirties <= 827; thirties++) {
		for (let verse = 1; verse <= 30; verse++) {
			entryArray.push({
				sigla: 'd',
				thirties: `${thirties}`,
				verse: `${verse}`
			});
		}
	}

	return entryArray;
}
