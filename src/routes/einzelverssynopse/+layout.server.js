import { teipb, api } from '$lib/constants';
import { writeFile } from 'node:fs';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
	console.log('loading einzelverssynopse');
	const publisherData = fetch(`/einzelverssynopse/publisherdata_verse.json`);
	console.log('publisherData', publisherData);

	if (!(await publisherData).ok) {
		console.log('fetching from api');
		const { codices } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json());
		const siglaArray = codices.map((/** @type {{ handle: string; }} */ codex) => codex.handle);
		let fetchPublisherData = {};
		siglaArray.forEach(async (/** @type {string} */ handle) => {
			fetchPublisherData[handle] = fetch(
				`${teipb}/parts/${handle}.xml/json?odd=parzival-verse-inline.odd&view=single`
			).then((r) => r.json());
		});
		//await all promises
		await Promise.allSettled(Object.values(fetchPublisherData));
		// Await all the values of the object
		const resolvedPublisherData = {};
		for (const [key, value] of Object.entries(fetchPublisherData)) {
			resolvedPublisherData[key] = await value;
		}
		console.log('writing the file');
		// Write the resolved data to the file
		writeFile(
			'./src/routes/einzelverssynopse/publisherdata_verse.json',
			JSON.stringify(resolvedPublisherData),
			(err) => {
				if (err) {
					console.error(err);
				} else {
					console.log('file written successfully');
				}
			}
		);
		return resolvedPublisherData;
	}

	// @ts-ignore
	return await publisherData.then((r) => r.json());
}
