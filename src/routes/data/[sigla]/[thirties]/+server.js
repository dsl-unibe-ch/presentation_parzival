import { json } from '@sveltejs/kit';
import { teipb } from '$lib/constants';
import { generateEntries } from '$lib/functions';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	let returnobj = { content: '', footnotes: '' };
	try {
		returnobj = await fetch(
			`${teipb}/parts/${params.sigla}.xml/json?odd=parzival-verse.odd&view=page&id=${params.sigla}${params.thirties?.padStart(3, '0') ?? '001'}`
		).then((r) => r.json());
	} catch (error) {
		// Handle the error here
		console.error(error);
	}
	return json({ content: returnobj.content, footnotes: returnobj.footnotes });
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return generateEntries(true);
}
