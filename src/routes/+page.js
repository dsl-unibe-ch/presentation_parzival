import { api } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const { codices, fragments } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) =>
		r.json()
	);
	return {
		tableData: await fetch(`${api}/json/contiguous_ranges.json`).then((res) => res.json()),
		codices,
		fragments
	};
}
