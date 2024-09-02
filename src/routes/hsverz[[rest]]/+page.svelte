<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ sigla } = data);
</script>

<div class="container mx-auto typography">
	<h1 class="h1">Parzival-Handschriften und Fragmente zu den Editionsproben</h1>
	{#each sigla.codices as { sigil, loc, cod, info }}
		<h2>Hs. {sigil}</h2>
		{#if typeof loc === 'string'}
			<p>{loc}, {cod}</p>
		{:else}
			{#each loc as location, i}
				<p>{location}, {cod[i]}</p>
			{/each}
		{/if}
		{#if info}
			<p>{@html info}</p>
		{/if}
	{/each}
	{#each sigla.fragments as { sigil, loc, cod, info }}
		<h2>{@html sigil}</h2>
		{#if typeof loc === 'string'}
			<p>{loc}, {cod}</p>
		{:else}
			{#each loc as location, i}
				<p>{location}, {cod[i]}</p>
			{/each}
		{/if}
		{#if info}
			<p>{@html info}</p>
		{/if}
	{/each}
</div>
