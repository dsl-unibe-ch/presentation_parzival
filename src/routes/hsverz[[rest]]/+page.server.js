import { api } from '$lib/constants';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		sigla: await fetch(`${api}/json/metadata-nomenclature.json`).then((res) => res.json())
	};
}
