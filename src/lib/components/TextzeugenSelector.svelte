<script>
	import { codices, fragments } from '$lib/sigla.json';
	import VerseSelector from '$lib/components/VerseSelector.svelte';

	let selectedSigla = ['', ''];
</script>

<div class="flex gap-1 my-3">
	{#each Array.from({ length: 2 }) as _, i}
		<label>
			Textzeugen: <select class="select my-2" bind:value={selectedSigla[i]}>
				<option value="">Textzeuge 1</option>
				{#each [...codices, ...fragments] as { sigil, handle }}
					<option value={handle}>{sigil}</option>
				{/each}
			</select>
		</label>
	{/each}
</div>
<div class="flex max-w-full items-baseline gap-1 my-3">
	<VerseSelector targetPath={`/textzeugen/${selectedSigla.join('-')}`} />
</div>
