<script>
	import { codices, fragments } from '$lib/sigla.json';

	export let value = '';
</script>

<label>
	Textzeugen: <select class="select my-2" bind:value>
		<option value="">Textzeuge 1</option>
		{#each [...codices, ...fragments] as { sigil, handle }}
			<option value={handle}>{sigil}</option>
		{/each}
	</select>
</label>
