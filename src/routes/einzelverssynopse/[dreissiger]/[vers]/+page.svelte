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
		const archetype = sigla.hyparchetypes.map((e) => e.handle);
		const witnesses = sigla.codices.map((e) => e.handle);
		const handlePromises = (/** @type {Response} */ r, /** @type {string} */ element) => {
			if (!r.ok) {
				loss.push(element);
			}
			return r.json();
		};
		witnesses.forEach((element) => {
			publisherData[element] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element}_${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element));
		});
		archetype.forEach((element) => {
			publisherData[element] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/syn${data.dreissiger}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element}%20${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element));
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
