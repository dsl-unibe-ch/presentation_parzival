<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

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

	const scrollToVerse = (/** @type {HTMLDivElement} */ node, /** @type {String} */ targetVerse) => {
		const verse = node.querySelector(`[data-verse="${targetVerse}"]`);
		if (!verse) return;
		verse.scrollIntoView({ behavior: 'smooth', block: 'center' });
		verse.parentElement?.classList.add('animate-bounce', 'once');

		return {
			/**
			 * @param {String} targetVerse
			 */
			update(targetVerse) {
				const verse = node.querySelector(`[data-verse="${targetVerse}"]`);
				if (!verse) return;
				verse.scrollIntoView({ behavior: 'smooth', block: 'center' });
				verse.parentElement?.classList.add('animate-bounce', 'once');
			},
			destroy() {}
		};
	};
	const onScrollEnd = (/** @type { Event & { target: HTMLElement}} } */ e) => {
		const /** @type { NodeListOf<HTMLElement> } */ verses = e.target?.querySelectorAll('.verse');
		let found = false;
		for (let i = 0; i < verses.length; i++) {
			const verse = verses[i];
			if (
				verse.getBoundingClientRect().top === e.target.getBoundingClientRect().top &&
				verse.dataset.verse
			) {
				currentVerse = verse.dataset.verse;
				found = true;
				break;
			}
		}
		if (!found) {
			for (let i = 0; i < verses.length; i++) {
				const verse = verses[i];
				if (
					verse.getBoundingClientRect().top >= e.target.getBoundingClientRect().top &&
					verse.dataset.verse
				) {
					console.log(verse.getBoundingClientRect().top, e.target.getBoundingClientRect().top);
					currentVerse = verse.dataset.verse;
					break;
				}
			}
		}
	};
	let currentVerse = `${data.thirties}.${data.verse}`;
	let targetVerse = currentVerse;
</script>

<section class="w-full">
	<h1 class="h1 my-4">Textzeugen</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>
			Dies ist die Textzeugenansicht. Derzeit {Number(data.sigla?.length) > 1 ? 'werden' : 'wird'}
			{data?.sigla ? generateLabel(data.sigla) : 'keine Textzeugen'} angezeigt. Mit dem Selektor können
			Sie die Textzeugen wechseln.
		</p>
		<TextzeugenSelector
			sigla={[...data.codices, ...data.fragments]}
			selectedSigla={data.sigla ? [...data.sigla] : []}
			coordinates={typeof data.thirties === 'string' && typeof data.verse === 'string'
				? [data.thirties, data.verse]
				: false}
		/>
	</div>
</section>
{#if data.sigla}
	{#each data.sigla as _witnes, i}
		<article class="grid grid-cols-2 bg-surface-active-token">
			<section>
				<div>
					<h2 class="h2">Textzeuge: {generateLabel([data.sigla[i]])}</h2>
					<p>
						Vers: {currentVerse}
					</p>
				</div>
				{#if typeof data.tpData === 'object'}
					{#await data.tpData[i]}
						<p>Loading...</p>
					{:then tpData}
						{#if tpData}
							{#if tpData?.content}
								<!-- find <cb> and divide the content into two divs-->
								{@const columns = tpData.content.split('<br class="tei-cb">')}
								<div
									class="flex flex-row gap-5 max-h-[70vh] overflow-y-auto snap-y"
									on:scrollend={onScrollEnd}
									use:scrollToVerse={targetVerse}
								>
									{#each columns as column}
										<div class="column">{@html column}</div>
									{/each}
								</div>
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
			</section>
			<section>
				{#if typeof data.iiif === 'object'}
					<IIIFViewer iiif={data.iiif[i]} />
				{/if}
			</section>
		</article>
	{/each}
{/if}

<style>
	.column :global(.line) {
		@apply snap-start;
		display: flex;
		gap: 1em;
		margin: 0.5em 0;
	}

	.column :global(.once) {
		-webkit-animation-iteration-count: 4;
		animation-iteration-count: 4;
	}
</style>
