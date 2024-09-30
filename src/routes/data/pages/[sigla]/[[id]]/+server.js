import { json } from '@sveltejs/kit';
import { teipb, api } from '$lib/constants';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	console.log('pagedata', params);
	return json(
		await fetch(
			`${teipb}/parts/${params.sigla}.xml/json?&view=page${params.id ? '&id=' + params.id : ''}&odd=parzival-verse.odd`
		).then((r) => r.json())
	);
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const { codices } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json());
	const siglaArray = codices.map((/** @type {{ handle: string; }} */ codex) => codex.handle);
	/**
	 * @type {import("./$types").RouteParams[]}
	 */
	let entryArray = [];
	siglaArray.forEach(async (/** @type {string} */ sigla) => {
		const register = await fetch(`${api}/json/metadata-ms-page/${sigla}.json`).then((r) =>
			r.json()
		);
		const pages = register[sigla].map((/** @type {{ id: string; }} */ page) => page.id);
		pages.forEach((/** @type {string} */ page) => {
			entryArray.push({ sigla, id: page });
		});
	});
	return entryArray;
}
