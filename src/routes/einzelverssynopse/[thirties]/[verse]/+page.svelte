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
			publisherData[element.handle] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/${element.handle}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/l[@xml:id=%27${element.handle}_${data.thirties}.${data.verse}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
		console.log(publisherData);
	});

	$: if (hyparchetypesSlider) {
		sigla.hyparchetypes.forEach((element) => {
			publisherData[element.handle] = fetch(
				`https://tei-ub.dh.unibe.ch/exist/apps/parzival/api/parts/syn${data.thirties}.xml/json?odd=parzival.odd&view=single&xpath=//text/body/div/div/l[@n=%27${element.handle}%20${data.thirties}.${data.verse}%27]`
			).then((r) => handlePromises(r, element.sigil));
		});
	} else {
		sigla.hyparchetypes.forEach((element) => {
			delete publisherData[element.handle];
		});
		publisherData = publisherData;
	}
</script>

<div class="container mx-auto p-4 flex flex-wrap justify-between gap-9">
	<h1 class="h1 w-full">Verssynopse zu {data.thirties}.{data.verse}</h1>
	<div>
		<dl class="grid grid-cols-[auto_1fr] justify-between h-fit mb-4 w-fit font-mono">
			<dt class="font-bold font-heading-token pr-4">Handschrift</dt>
			<dd class="font-bold font-heading-token border-l-2 border-current pl-4">Wortlaut</dd>
			{#each sigla.hyparchetypes as archetype (archetype.handle)}
				{#if hyparchetypesSlider}
					<dt class="pr-4 py-1 font-sans">{archetype.sigil}</dt>
					{#await publisherData[archetype.handle]}
						<dd class="border-l-2 border-current pl-4 py-1 font-sans"></dd>
					{:then value}
						{#if value?.content}
							<dd class="border-l-2 border-current pl-4 py-1 font-sans">{@html value?.content}</dd>
						{:else}
							<dd class="border-l-2 border-current pl-4 py-1"></dd>
						{/if}
					{/await}
				{/if}
				{#each archetype.witnesses as witness}
					{#await publisherData[witness] then value}
						{#if value?.content}
							<dt class="pr-4 pt-2 {hyparchetypesSlider ? 'ml-5' : ''}">
								{sigla.codices.find((c) => c.handle === witness)?.sigil}
							</dt>
							<dd class="border-l-2 border-current {hyparchetypesSlider ? 'ml-5' : ''} pl-4 py-1">
								{@html value.content}
							</dd>
						{/if}
					{:catch error}
						<p>error: {error.message}</p>
					{/await}
				{/each}
			{/each}
		</dl>
		{#if loss.length > 0}
			<p class="max-w-sm">
				Der Vers {data.thirties}.{data.verse} fehlt in folgenden Handschriften aufgrund eines umfangreichen
				Textausfalls (Fragmente werden für diese Auflistung nicht berücksichtigt):
				<b>{loss.join(', ')}</b>
			</p>
		{/if}
	</div>
	<section>
		<SlideToggle
			name="hyparchetypes-slider"
			active="bg-primary-500"
			bind:checked={hyparchetypesSlider}
		>
			Fassungsverse ein-/ausblenden und nach diesen sortieren
		</SlideToggle>
		<h2 class="h2 my-7">Zu Vers springen:</h2>
		<VerseSelector targetPath="/einzelverssynopse" />
	</section>
</div>
