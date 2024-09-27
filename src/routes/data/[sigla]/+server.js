import { json } from '@sveltejs/kit';
import { teipb, api } from '$lib/constants';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	console.log(params);
	return json(
		await fetch(
			`${teipb}/parts/${params.sigla}.xml/json?odd=parzival-verse-inline.odd&view=single`
		).then((r) => r.json())
	);
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const { codices } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json());
	const siglaArray = codices.map((codex) => codex.handle);
	return siglaArray.map((sigla) => ({ sigla }));
}
