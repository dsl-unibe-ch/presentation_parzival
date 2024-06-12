<script>
	import { codices, fragments } from '$lib/sigla.json';
	import VerseSelector from '$lib/components/VerseSelector.svelte';

	export let selectedSigla = ['d', ''];

	export let coordinates = ['', ''];
</script>

<div class="flex gap-1 my-3">
	{#each Array.from({ length: 2 }) as _, i}
		<label>
			Textzeuge: <select class="select my-2" bind:value={selectedSigla[i]}>
				{#if i !== 0}<option value="">kein Textzeuge</option>{/if}
				{#each [...codices, ...fragments] as { sigil, handle }}
					<option value={handle}>{sigil}</option>
				{/each}
			</select>
		</label>
	{/each}
</div>
<div class="flex max-w-full items-baseline gap-1 my-3">
	<VerseSelector
		targetPath={`/textzeugen/${selectedSigla.filter((e) => !!e).join('-')}`}
		{coordinates}
	/>
</div>
