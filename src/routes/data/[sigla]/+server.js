import { json } from '@sveltejs/kit';
import { teipb, api } from '$lib/constants';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	let returnobj = { content: '', footnotes: '' };
	return json(
		await recursiveFetch(
			`${teipb}/parts/${params.sigla}.xml/json?odd=parzival-verse-inline.odd&view=page`,
			returnobj,
			fetch
		)
	);
}

const recursiveFetch = async (url, returnobj, sfetch, nextId = '') => {
	let current = await sfetch(`${url}&id=${nextId}`).then((r) => r.json());
	returnobj.content += current.content;
	returnobj.footnotes += current.footnotes;
	if (current.nextId) {
		console.log(current.nextId);
		return await recursiveFetch(url, returnobj, sfetch, current.nextId);
	} else {
		console.log('done');
		return returnobj;
	}
};

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const { codices } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json());
	const siglaArray = codices.map((codex) => codex.handle);
	return siglaArray.map((sigla) => ({ sigla }));
}
