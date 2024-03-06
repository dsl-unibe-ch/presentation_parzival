<script>
	import { onMount } from 'svelte';
	import sigla from '$lib/sigla.json';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import VerseSelector from '$lib/components/VerseSelector.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {{ [key: string]: Promise<any> }} */
	let publisherData = {};
	/**
	 * @type {string[]}
	 */
	let loss = [];

	let hyparchetypesSlider = false;

	const handlePromises = (/** @type {Response} */ r, /** @type {string} */ element) => {
		if (!r.ok) {
			loss = [...loss, element];
		}
		return r.json();
	};

	onMount(() => {
		sigla.codices.forEach((element) => {
			publisherData[element.sigil] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
		console.log(publisherData);
	});

	$: if (hyparchetypesSlider) {
		sigla.hyparchetypes.forEach((element) => {
			publisherData[element.sigil] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/syn${data.dreissiger}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element.handle}%20${data.dreissiger}.${data.vers}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
	}
</script>

<div class="container mx-auto mt-5 flex flex-wrap justify-between">
	<h1 class="h1 mb-9 w-full">Verssynopse zu {data.dreissiger}.{data.vers}</h1>
	<div>
		<dl class="grid grid-cols-[auto_1fr] justify-between h-fit my-4 w-fit">
			<dt class="font-bold font-heading-token border-r-4 border-current pr-4">Handschrift</dt>
			<dd class="font-bold font-heading-token pl-2">Wortlaut</dd>
			{#each Object.entries(publisherData) as [key, value]}
				{#await value then value}
					{#if value.content}
						<dt class="border-r-4 border-current pr-4 pt-4">{key}</dt>
						<dd class="pl-2 pt-4">{@html value.content}</dd>
					{/if}
				{:catch error}
					<p>error: {error.message}</p>
				{/await}
			{/each}
		</dl>
		{#if loss.length > 0}
			<p class="max-w-sm">
				Der Vers {data.dreissiger}.{data.vers} fehlt in folgenden Handschriften aufgrund eines umfangreichen
				Textausfalls (Fragmente werden für diese Auflistung nicht berücksichtigt):
				<b>{loss.join(', ')}</b>
			</p>
		{/if}
	</div>
	<section>
		<SlideToggle name="hyparchetypes-slider" bind:checked={hyparchetypesSlider}
			>Fassungsverse ein-/ausblenden und nach diesen sortieren</SlideToggle
		>
		<h2 class="h2 my-7">Zu Vers springen:</h2>
		<VerseSelector />
	</section>
</div>
