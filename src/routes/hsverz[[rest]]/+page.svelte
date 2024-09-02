<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ sigla } = data);
</script>

<div class="container mx-auto typography">
	<h1 class="h1">Parzival-Handschriften und Fragmente zu den Editionsproben</h1>
	{#each sigla.codices as codex}
		<h2>Hs. {codex.sigil}</h2>
		<p>{codex.loc}, {codex.cod}</p>
		{#if codex.info}
			<p>{@html codex.info}</p>
		{/if}
	{/each}
	{#each sigla.fragments as fragment}
		<h2>{@html fragment.sigil}</h2>
		{#if typeof fragment.loc === 'string'}
			<p>{fragment.loc}, {fragment.cod}</p>
		{:else}
			{#each fragment.loc as loc, i}
				<p>{loc}, {fragment.cod[i]}</p>
			{/each}
		{/if}
		{#if fragment.info}
			<p>{@html fragment.info}</p>
		{/if}
	{/each}
</div>
