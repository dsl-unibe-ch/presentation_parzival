import { generateEntries } from '$lib/functions';
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	/** @type {{ [key: string]: Promise<any> }} */

	return {
		sigla: params.sigla.split('-'),
		thirties: params.thirties,
		verse: params.verse.padStart(2, '0')
	};
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	// @ts-ignore
	return generateEntries(true);
}
