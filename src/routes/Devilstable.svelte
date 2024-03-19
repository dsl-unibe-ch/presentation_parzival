<script>
	import * as d3 from 'd3';

	let width = 400;
	let height = 400;
	let marginTop = 20;
	let marginRight = 20;
	let marginBottom = 20;
	let marginLeft = 20;

	let gx, gy;

	let data = [
		{
			label: 'D',
			values: [
				[1, 3],
				[15, 20]
			]
		},
		{
			label: 'n',
			values: [
				[1, 16],
				[18, 25]
			]
		}
	];

	$: x = d3.scaleBand(
		data.map((d) => d.label),
		[marginLeft, width - marginRight]
	);
	$: y = d3.scaleLinear(d3.extent(data.flatMap((d) => d.values.flat())), [
		height - marginBottom,
		marginTop
	]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: console.log(d3.extent(data.flatMap((d) => d.values.flat())));
</script>

<svg width="400" height="400">
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	{#each data as sigla, i}
		{#each sigla.values as [start, end]}
			<path
				fill="none"
				stroke="currentColor"
				stroke-width={4}
				d={`
					M${x(sigla.label)} ${y(start)}
					L${x(sigla.label)} ${y(end)}
				`}
			/>
		{/each}
	{/each}
</svg>
