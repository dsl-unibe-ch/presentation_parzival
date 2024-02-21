<script>
	import { onMount } from 'svelte';
	import sigla from '$lib/sigla';

	/** @type {import('./$types').PageData} */
	export let data;

	let publisherData;

	onMount(() => {
		sigla.actual.forEach((element) => {
			publisherData[element] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.toLowerCase()}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.toLowerCase()}_${data.dreissiger}.${data.vers}%27]`
			).then((r) => r.json());
		});
		sigla.normalized.forEach((element) => {
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
