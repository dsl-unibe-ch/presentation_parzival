<script>
	import { onMount } from 'svelte';
	import sigla from '$lib/sigla.json';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {{ [key: string]: Promise<any> }} */
	let publisherData = {};
	/**
	 * @type {string[]}
	 */
	let loss = [];

	onMount(() => {
		const handlePromises = (/** @type {Response} */ r, /** @type {string} */ element) => {
			if (!r.ok) {
				loss = [...loss, element];
			}
			return r.json();
		};
		sigla.codices.forEach((element) => {
			publisherData[element.sigil] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
		sigla.hyparchetypes.forEach((element) => {
			publisherData[element.sigil] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/syn${data.dreissiger}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element.handle}%20${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
		console.log(publisherData);
	});
</script>

<div class="container mx-auto mt-5">
	<h1 class="h1">Verssynopse zu {data.dreissiger}.{data.vers}</h1>

	<dl>
		<dt>Handschrift</dt>
		<dd>Wortlaut</dd>
		{#each Object.entries(publisherData) as [key, value]}
			{#await value then value}
				{#if value.content}
					<dt>{key}</dt>
					<dd>{@html value.content}</dd>
				{/if}
			{:catch error}
				<p>error: {error.message}</p>
			{/await}
		{/each}
	</dl>
	{#if loss.length > 0}
		<p>Die folgenden Handschriften konnten nicht geladen werden: {loss.join(', ')}</p>
	{/if}
</div>
