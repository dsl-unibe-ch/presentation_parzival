import { api } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	return {
		tableData: await fetch(`${api}/json/contiguous_ranges.json`).then((res) => res.json())
	};
}
