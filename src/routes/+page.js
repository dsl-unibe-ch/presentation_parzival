/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	return {
		tableData: await fetch(
			'https://dhbern.github.io/parzival-static-api/api/json/contiguous_ranges.json'
		).then((res) => res.json())
	};
}
