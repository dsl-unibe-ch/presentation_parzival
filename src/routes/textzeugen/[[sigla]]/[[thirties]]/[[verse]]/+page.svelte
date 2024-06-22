<script>
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import IIIFViewer from '$lib/components/IIIFViewer.svelte';
	import TextzeugenContent, { setTarget } from './TextzeugenContent.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	$: selectedSigla = data.content ? data.content.map((c) => c.sigla) : [];

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

	const generateCloseLink = (/** @type {String} */ sigla) => {
		const siglas = selectedSigla.filter((e) => e !== sigla);
		let path = `${base}/textzeugen/${siglas.join('-')}`;
		if (siglas.length) {
			if (data.thirties) {
				path += `/${data.thirties}`;
				if (data.verse) {
					path += `/${data.verse}`;
				}
			}
		}
		return path;
	};

	const generateIiifLink = (
		/** @type {URL} */ url,
		/** @type {Number} */ i,
		/** @type {boolean} */ close
	) => {
		let link = new URL(url.toString());
		const currentParam = url.searchParams.get('iiif')?.split('-') ?? [];
		if (close) {
			currentParam[i] = String(close);
			link.searchParams.set('iiif', currentParam.join('-'));
		} else {
			currentParam[i] = '';
			if (currentParam.some((e) => e === 'true')) {
				link.searchParams.set('iiif', currentParam.join('-'));
			} else {
				link.searchParams.delete('iiif');
			}
		}
		return link.toString();
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
	<div class="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-4">
		{#each data.content as content, i}
			<article
				class="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-4 bg-surface-active-token my-4 py-4 px-8 rounded-xl relative"
			>
				<section>
					<div class="mb-4 relative">
						<h2 class="h2">Textzeuge: {generateLabel([content.sigla])}</h2>
						<p>
							Vers: {localVerses[i]}
						</p>
						<a class="btn btn-icon absolute top-0 right-0" href={generateCloseLink(content.sigla)}
							><i class="fa-solid fa-x"></i></a
						>
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
				{#if !($page.url.searchParams.get('iiif')?.split('-')[i] === 'true')}
					<section class="min-h-[40vh] relative">
						{#await content.meta then meta}
							{#if typeof meta === 'object' && typeof meta.tpData === 'object'}
								{#await meta.iiif}
									<p>Loading...</p>
								{:then iiif}
									{#if typeof iiif === 'object'}
										<a
											class="btn btn-icon absolute top-0 right-0 z-10"
											href={generateIiifLink($page.url, i, true)}><i class="fa-solid fa-x"></i></a
										>
										<IIIFViewer {iiif} />
									{/if}
								{:catch error}
									<p style="color: red">{error.message}</p>
								{/await}
							{/if}
						{/await}
					</section>
				{:else}
					<a class="btn btn-icon" href={generateIiifLink($page.url, i, false)}
						><i class="fa-solid fa-image"></i></a
					>
				{/if}
			</article>
		{/each}
	</div>
{/if}
