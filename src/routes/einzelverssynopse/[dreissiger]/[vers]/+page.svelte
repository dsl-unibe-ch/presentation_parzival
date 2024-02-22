<script>
	import { onMount } from 'svelte';
	import sigla from '$lib/sigla.json';

	/** @type {import('./$types').PageData} */
	export let data;

	let publisherData = {};

	onMount(() => {
		const archetype = sigla.hyparchetypes.map((e) => e.handle);
		const witnesses = sigla.codices.map((e) => e.handle);
		console.log(archetype);
		console.log(witnesses);
		witnesses.forEach((element) => {
			publisherData[element] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element}_${data.dreissiger}.${data.vers}%27]`
			).then((r) => r.json());
		});
		archetype.forEach((element) => {
			publisherData[element] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/syn${data.dreissiger}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element}%20${data.dreissiger}.${data.vers}%27]`
			).then((r) => r.json());
		});

		console.log(publisherData);
	});
</script>

<div class="container mx-auto mt-5">
	<h1 class="h1">Verssynopse zu {data.dreissiger}.{data.vers}</h1>

	<dl>
		<dt>Handschrift</dt>
		<dd>Wortlaut</dd>
	</dl>
</div>
