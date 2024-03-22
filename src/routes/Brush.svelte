<script>
	import * as d3 from 'd3';

	export let width = 400;
	export let height = 150;
	let marginTop = 20;
	let marginRight = 20;
	let marginBottom = 20;
	let marginLeft = 20;
	let chunkWidth = 18;
	export let DATA_MIN = 1;
	export let DATA_MAX = 822;

	/**
	 * @type {SVGGElement}
	 */
	let gx;
	/**
	 * @type {SVGGElement}
	 */
	let gy;

	export let data = [
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
	$: numChunks = Math.max(Math.floor((width - marginLeft - marginRight) / chunkWidth), 1);
	$: pointsPerRect = Math.ceil((DATA_MAX - DATA_MIN) / numChunks);
	$: console.log(width, numChunks, pointsPerRect);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	$: chunkedData = data.map((d) => {
		const chunked = new Array(numChunks).fill(0);

		for (let i = 0; i < numChunks; i++) {
			const start = i * pointsPerRect;
			const end = Math.min((i + 1) * pointsPerRect, DATA_MAX);

			for (let j = start; j < end; j++) {
				if (d.values[j]) {
					chunked[i]++;
				}
			}
		}

		return {
			label: d.label,
			values: chunked
		};
	});

	$: y = d3
		.scaleBand(
			data.map((d) => d.label),
			[height - marginTop, marginBottom]
		)
		.paddingOuter(0.05)
		.round(true);
	$: xChunk = d3.scaleLinear([0, numChunks], [marginLeft, width - marginRight]);
	$: x = d3.scaleLinear([DATA_MIN, DATA_MAX], [marginLeft, width - marginRight]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));
</script>

<svg {width} {height}>
	<g bind:this={gy} transform="translate({marginLeft - 5} ,0)" />
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	{#each chunkedData as d}
		<g>
			{#each d.values as v, j}
				{@const start = xChunk(j)}
				{@const end = xChunk(j + 1)}
				<rect
					x={start}
					y={y(d.label)}
					width={end - start}
					height={y.bandwidth()}
					fill={v ? 'black' : 'white'}
				/>
			{/each}
		</g>
	{/each}
</svg>
