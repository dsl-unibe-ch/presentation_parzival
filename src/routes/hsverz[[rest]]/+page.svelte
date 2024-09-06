<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ sigla } = data);
</script>

<div class="container mx-auto typography">
	<h1 class="h1">Parzival-Handschriften und Fragmente zu den Editionsproben</h1>
	{#each [...sigla.codices, ...sigla.fragments] as { "info-h1": sigil, "info-h2": loc, info }}
		<h2>{@html sigil}</h2>
		<div class="[&_ul]:!list-none [&_ul]:!pl-0 [&_li]:font-bold">
			{@html loc}
		</div>
		{#if info}
			<p>{@html info}</p>
		{/if}
	{/each}
</div>
