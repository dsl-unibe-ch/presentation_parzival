<script>
	import { assets } from '$app/paths';
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {import('openseadragon') | undefined}
	 */
	let OpenSeadragon;

	/**
	 * @type {import('openseadragon').Viewer[]}
	 */
	let viewer = [];

	const generateViewer = (node, iiif) => {
		const i = node.id.split('-')[1];
		if (!iiif || iiif[i] === 'not found') return;
		/** @type {ResizeObserver}*/
		let observer;
		const createViewer = () => {
			viewer[i] = new OpenSeadragon.Viewer({
				id: node.id,
				prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
				navImages: {
					zoomIn: {
						REST: 'zoomin_rest.svg',
						GROUP: 'zoomin_grouphover.svg',
						HOVER: 'zoomin_hover.svg',
						DOWN: 'zoomin_pressed.svg'
					},
					next: {
						REST: 'next_rest.svg',
						GROUP: 'next_grouphover.svg',

						HOVER: 'next_hover.svg',
						DOWN: 'next_pressed.svg'
					},
					previous: {
						REST: 'previous_rest.svg',
						GROUP: 'previous_grouphover.svg',
						HOVER: 'previous_hover.svg',
						DOWN: 'previous_pressed.svg'
					},
					fullpage: {
						REST: 'fullpage_rest.svg',
						GROUP: 'fullpage_grouphover.svg',
						HOVER: 'fullpage_hover.svg',
						DOWN: 'fullpage_pressed.svg'
					},
					home: {
						REST: 'home_rest.svg',
						GROUP: 'home_grouphover.svg',
						HOVER: 'home_hover.svg',
						DOWN: 'home_pressed.svg'
					},
					zoomOut: {
						REST: 'zoomout_rest.svg',
						GROUP: 'zoomout_grouphover.svg',
						HOVER: 'zoomout_hover.svg',
						DOWN: 'zoomout_pressed.svg'
					},
					rotateleft: {
						REST: 'rotateleft_rest.svg',
						GROUP: 'rotateleft_grouphover.svg',
						HOVER: 'rotateleft_hover.svg',
						DOWN: 'rotateleft_pressed.svg'
					},
					rotateright: {
						REST: 'rotateright_rest.svg',
						GROUP: 'rotateright_grouphover.svg',
						HOVER: 'rotateright_hover.svg',
						DOWN: 'rotateright_pressed.svg'
					},
					flip: {
						REST: 'flip_rest.svg',
						GROUP: 'flip_grouphover.svg',
						HOVER: 'flip_hover.svg',
						DOWN: 'flip_pressed.svg'
					}
				},
				sequenceMode: false
			});
			iiif.then((iiif) => viewer[i].open(iiif));
			observer = new ResizeObserver((_entries) => {
				setTimeout(() => {
					viewer[i].viewport.goHome(false);
				}, 50);
			});
			observer.observe(node);
		};
		if (!OpenSeadragon) {
			import('openseadragon').then((r) => {
				OpenSeadragon = r.default;
				createViewer();
			});
		} else {
			createViewer();
		}

		return {
			update(iiif) {
				iiif.then((iiif) => viewer[i].open(iiif));
			},
			destroy() {
				viewer[i].destroy();
				if (observer) {
					observer.disconnect();
				}
			}
		};
	};

	const generateLabel = (sigla) => {
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

	const scrollToVerse = (node, targetVerse) => {
		const verse = node.querySelector(`[data-verse="${targetVerse}"]`);
		verse.scrollIntoView({ behavior: 'smooth', block: 'center' });
		verse.parentElement.classList.add('animate-bounce', 'once');

		return {
			update(targetVerse) {
				const verse = node.querySelector(`[data-verse="${targetVerse}"]`);
				verse.scrollIntoView({ behavior: 'smooth', block: 'center' });
				verse.parentElement.classList.add('animate-bounce', 'once');
			},
			destroy() {}
		};
	};
	const onScrollEnd = (/** @type { Event } */ e) => {
		const verses = e.target?.querySelectorAll('.verse');
		let found = false;
		for (let i = 0; i < verses.length; i++) {
			const verse = verses[i];
			if (verse.getBoundingClientRect().top === e.target.getBoundingClientRect().top) {
				console.log(verse.getBoundingClientRect().top, e.target.getBoundingClientRect().top);
				currentVerse = verse.dataset.verse;
				found = true;
				break;
			}
		}
		if (!found) {
			for (let i = 0; i < verses.length; i++) {
				const verse = verses[i];
				if (verse.getBoundingClientRect().top >= e.target.getBoundingClientRect().top) {
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
			Dies ist die Textzeugenansicht. Derzeit {data.sigla?.length > 1 ? 'werden' : 'wird'}
			{data?.sigla ? generateLabel(data.sigla) : 'keine Textzeugen'} angezeigt. Mit dem Selektor können
			Sie die Textzeugen wechseln.
		</p>
		<TextzeugenSelector
			sigla={[...data.codices, ...data.fragments]}
			selectedSigla={data.sigla ? [...data.sigla] : []}
			coordinates={[data.thirties, data.verse]}
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
			</section>
			<section>
				<div id="viewer-{i}" class="w-full h-full" use:generateViewer={data.iiif[i]}></div>
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
