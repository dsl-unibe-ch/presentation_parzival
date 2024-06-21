<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';
	import TextzeugenContent, { setTarget } from './TextzeugenContent.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const selectedSigla = data.content ? data.content.map((c) => c.sigla) : [];

	const generateLabel = (/** @type {String[]} */ sigla) => {
		const info = [...data.codices, ...data.fragments];
		sigla.map((s) => {
			const found = info.find((i) => i.sigil === s);
			if (found) {
				const { sigil, handle, ...rest } = found;
				return `${sigil} (${rest})`;
			}
			return s;
		});
		return sigla.join(' und ');
	};

	setTarget(`${data.thirties}.${data.verse}`);
	let localVerses = Array(data.content?.length).fill(`${data.thirties}.${data.verse}`);
</script>

<section class="w-full">
	<h1 class="h1 my-4">Textzeugen</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>
			Dies ist die Textzeugenansicht. Derzeit {Number(data.content?.length) > 1 ? 'werden' : 'wird'}
			{data?.content ? generateLabel(selectedSigla) : 'keine Textzeugen'} angezeigt. Mit dem Selektor
			können Sie die Textzeugen wechseln.
		</p>
		<TextzeugenSelector
			sigla={[...data.codices, ...data.fragments]}
			{selectedSigla}
			coordinates={[data.thirties, data.verse]}
		/>
	</div>
</section>
{#if data.content}
	{#each data.content as content, i}
		<article class="grid grid-cols-2 bg-surface-active-token">
			<section>
				<div>
					<h2 class="h2">Textzeuge: {generateLabel([content.sigla])}</h2>
					<p>
						Vers: {localVerses[i]}
					</p>
				</div>
				{#await content.meta then meta}
					{#if typeof meta === 'object' && typeof meta.tpData === 'object'}
						{#await meta.tpData}
							<p>Loading...</p>
						{:then tpData}
							{#if tpData}
								{#if tpData?.content}
									<TextzeugenContent
										content={tpData.content}
										on:localVerseChange={(e) => (localVerses[i] = e.detail)}
									/>
								{:else}
									{JSON.stringify(tpData)}
								{/if}
							{:else}
								<p>Der Vers existiert nicht</p>
							{/if}
						{:catch error}
							<p style="color: red">{error.message}</p>
						{/await}
					{/if}
				{/await}
			</section>
			<section>
				{#await content.meta then meta}
					{#if typeof meta === 'object' && typeof meta.tpData === 'object'}
						{#await meta.iiif}
							<p>Loading...</p>
						{:then iiif}
							{#if typeof iiif === 'object'}
								<IIIFViewer {iiif} />
							{/if}
						{:catch error}
							<p style="color: red">{error.message}</p>
						{/await}
					{/if}
				{/await}
			</section>
		</article>
	{/each}
{/if}
