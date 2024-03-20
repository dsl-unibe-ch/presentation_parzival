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

	$: x = d3
		.scaleBand(
			data.map((d) => d.label),
			[marginLeft, width - marginRight]
		)
		.paddingOuter(0.1)
		.paddingInner(0.2);
	$: y = d3.scaleLinear(d3.extent(data.flatMap((d) => d.values.flat())), [
		height - marginBottom,
		marginTop
	]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: console.log(y(data[0].values[1][1]) - y(data[0].values[1][0]));
	$: console.log(data[0].values[1][1], y(data[0].values[1][1]));
	$: console.log(data[0].values[1][0], y(data[0].values[1][0]));
</script>

<svg width="400" height="400">
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	{#each data as sigla, i}
		{#each sigla.values as [start, end]}
			<rect
				x={x(sigla.label)}
				y={y(end)}
				width={x.bandwidth()}
				height={y(start) - y(end)}
				fill="currentColor"
			/>
		{/each}
	{/each}
</svg>
