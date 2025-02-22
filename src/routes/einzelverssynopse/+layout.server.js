import { teipb, api } from '$lib/constants';
import { writeFile, readFile } from 'node:fs/promises';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
	console.log('loading einzelverssynopse');
	let publisherData;
	try {
		publisherData = await readFile('./src/routes/einzelverssynopse/publisherdata_verse.json', {
			encoding: 'utf8'
		});
		publisherData = JSON.parse(publisherData);
	} catch (error) {
		console.error('error importing the file', error);
		console.log('fetching from api');
		const { codices, hyparchetypes } = await fetch(`${api}/json/metadata-nomenclature.json`).then(
			(r) => r.json()
		);
		const siglaArray = codices.map((/** @type {{ handle: string; }} */ codex) => codex.handle);
		let fetchPublisherData = {};
		siglaArray.forEach(async (/** @type {string} */ handle) => {
			fetchPublisherData[handle] = await fetch(
				`${teipb}/parts/${handle}.xml/json?odd=parzival-verse-inline.odd&view=single`
			).then((r) => r.json());
		});

		// let synFiles = new Array(827).fill(null);
		// //get syn files
		// synFiles = synFiles.map((_, index) => {
		// 	return fetch(
		// 		`${teipb}/parts/syn${index + 1}.xml/json?odd=parzival-verse-inline.odd&view=single`
		// 	).then((r) => r.json());
		// });

		//await all promises
		await Promise.allSettled(Object.values(fetchPublisherData));
		// await Promise.allSettled(synFiles);
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
		publisherData = resolvedPublisherData;
	}

	console.log('done with the big data fetch');
	// @ts-ignore
	return publisherData;
}
