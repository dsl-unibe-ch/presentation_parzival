<script>
	import * as d3 from 'd3';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let width = 400;
	export let height = 150;
	let marginTop = 20;
	let marginRight = 0;
	let marginBottom = 20;
	let marginLeft = 28;
	const optimalChunkWidth = 18;
	export let DATA_MIN = 1;
	export let DATA_MAX = 827;

	/**
	 * @type {SVGGElement}
	 */
	let gx;
	/**
	 * @type {SVGGElement}
	 */
	let gy;

	/**
	 * @type {SVGGElement}
	 */
	let gBrush;

	/**
	 * @type {{values: boolean[], label: string}[]}
	 */
	export let data = [
		{
			label: 'D',
			values: []
		},
		{
			label: 'n',
			values: []
		}
	];
	$: availableWidth = width - marginLeft - marginRight;
	$: numChunks = Math.max(Math.floor(availableWidth / optimalChunkWidth), 1);
	$: colorScale = d3
		.scaleThreshold()
		.domain([0.001, 1 / 4, 2 / 4, 3 / 4, 0.9999])
		.range(['900', '600', '500', '400', '200', '50']);
	// $: colorScale = d3.scaleQuantize([0, 1], ['50', '200', '400', '500', '600', '900']);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	$: chunkedData = data.map((dataObject) => {
		const chunked = new Array(numChunks).fill(0);
		const chunkedPresent = new Array(numChunks).fill(0);
		for (let i = 0; i < numChunks; i++) {
			const start = xChunk(i);
			const end = xChunk(i + 1);
			dataObject.values.forEach((present, valIndex) => {
				const pos = x(valIndex);
				if (pos >= start && pos < end) {
					chunked[i]++;
					if (present) {
						chunkedPresent[i]++;
					}
				} else if (pos >= end) {
					return;
				}
			});
		}

		return {
			label: dataObject.label,
			values: chunked.map((val, i) => {
				return chunkedPresent[i] / val;
			})
		};
	});

	$: y = d3.scaleBand(
		data.map((d) => d.label),
		[height - marginTop, marginBottom]
	);
	$: xChunk = d3.scaleLinear([0, numChunks], [marginLeft, width - marginRight]);
	$: x = d3.scaleLinear([DATA_MIN, DATA_MAX], [marginLeft, width - marginRight]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: brush = d3
		.brushX()
		.extent([
			[marginLeft, 0],
			[width - marginRight, height - marginBottom - marginTop]
		])
		.on('brush', (/** @type {{ selection: [number, number]; }} */ e) => {
			const selection = e.selection;
			if (selection[1] - selection[0] <= 180) {
				const start = Math.round(x.invert(selection[0]));
				const end = Math.round(x.invert(selection[1]));

				dispatch('brush', { start, end });
			}
		})
		.on('end', (/** @type {{ selection: [number, number]; }} */ e) => {
			const selection = e.selection;
			if (selection[1] - selection[0] > 180) {
				const start = Math.round(x.invert(selection[0]));
				const end = Math.round(x.invert(selection[1]));

				dispatch('brush', { start, end });
			}
		});
	$: d3.select(gBrush)
		.call(brush)
		.call(brush.move, [x(DATA_MIN), x(100)]);
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
					fill={`rgb(var(--color-primary-${colorScale(v)}))`}
				/>
			{/each}
		</g>
	{/each}
	<g bind:this={gBrush} transform="translate(0,{marginTop})" />
</svg>
