import { api, teipb } from '$lib/constants';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const sigla = params.sigla?.split('-');
	/** @type string | boolean */
	let thirties = params.thirties ?? '1';
	/** @type string | boolean */
	let verse = params.verse?.padStart(2, '0') ?? '01';
	// if params.thirties is not defined, we need to find the lowest thirty & verse that exists in all siglas
	if (sigla?.length === 1) {
		const lowestPromises = fetch(`${api}/json/metadata-ms-page/${sigla[0]}.json`).then((r) =>
			r.json()
		);
		if (!params.thirties) {
			thirties = false;
			(await lowestPromises)[sigla[0]].forEach((/** @type {{id: String, l: String[]}} **/ page) => {
				if (page.id.includes(`${sigla[0]}001`)) {
					const [tThirty, tVerse] = page.l[0].split('.');
					if (!thirties || Number(tThirty) < Number(thirties)) {
						thirties = tThirty;
						verse = tVerse;
					}
				}
			});
		} else if (!params.verse) {
			verse = false;
			(await lowestPromises)[sigla[0]].some((/** @type {{id: String, l: String[]}} **/ page) => {
				const newVerse = page.l
					.find((/** @type {String} **/ l) => l.startsWith(thirties))
					?.split('.')[1];
				if (newVerse) {
					verse = newVerse;
					return true;
				}
			});
		}
	}

	const meta = sigla?.map(async (witnes) => {
		const data = await fetch(`${api}/json/metadata-ms-page/${witnes}.json`).then((r) => r.json());
		let returnObject;
		if (thirties) {
			returnObject = data[witnes].find(
				(/** @type {{ l: string, id:string | string[]; }} */ entry) =>
					entry.l.includes(`${thirties}.${verse}`)
			);
		} else {
			returnObject = data[witnes][0];
		}
		returnObject.iiif = fetch(returnObject.iiif).then((res) => res.json());
		returnObject.tpData = fetch(
			`${teipb}/parts/${witnes}.xml/json?&view=page&id=${returnObject.id}&odd=parzival.odd`
		).then((r) => r.json());
		return returnObject
			? { tpData: returnObject.tpData, iiif: returnObject.iiif, page: returnObject.id }
			: { tpData: false, iiif: false, page: false };
	});

	return {
		sigla,
		thirties,
		verse,
		tpData: meta ? (await Promise.all(meta)).map((m) => m?.tpData) : false,
		iiif: meta ? (await Promise.all(meta)).map((m) => m?.iiif) : false,
		page: meta ? (await Promise.all(meta)).map((m) => m?.page) : false
	};
}
