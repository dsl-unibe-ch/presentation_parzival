<script>
	import * as d3 from 'd3';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let width = 400;
	export let height = 150;
	let marginTop = 20;
	let marginRight = 0;
	let marginBottom = 20;
	$: marginLeft = mobile ? 30 : 35;
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
	$: mobile = width > height;
	$: availableWidth = width - marginLeft - marginRight;
	$: numChunks = mobile
		? Math.max(Math.floor(availableWidth / optimalChunkWidth), 1)
		: Math.max(Math.floor((height - marginTop - marginBottom) / optimalChunkWidth), 1);
	$: colorScale = d3
		.scaleThreshold()
		.domain([0.001, 1 / 4, 2 / 4, 3 / 4, 0.9999])
		.range(['900', '600', '500', '400', '200', '50']);
	// $: colorScale = d3.scaleQuantize([0, 1], ['50', '200', '400', '500', '600', '900']);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	$: sourcesDim = d3.scaleBand().domain(data.map((d) => d.label));
	$: xChunk = d3
		.scaleLinear()
		.domain([0, numChunks])
		.range(mobile ? [marginLeft, width - marginRight] : [marginBottom, height - marginTop]);

	$: valuesDim = d3.scaleLinear().domain([DATA_MIN, DATA_MAX]);
	/** @type any */
	let x, /** @type any */ y;
	$: {
		if (mobile) {
			x = valuesDim.range([marginLeft, width - marginRight]);
			y = sourcesDim.range([height - marginTop, marginBottom]);
		} else {
			x = sourcesDim.range([marginLeft, width - marginRight]);
			y = valuesDim.range([height - marginTop, marginBottom]);
		}
	}
	$: chunkedData = data.map((dataObject) => {
		const chunked = new Array(numChunks).fill(0);
		const chunkedPresent = new Array(numChunks).fill(0);
		for (let i = 0; i < numChunks; i++) {
			const start = xChunk(i);
			const end = xChunk(i + 1);
			dataObject.values.forEach((present, valIndex) => {
				const pos = valuesDim(valIndex);
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
	$: d3.select(gy).call(d3.axisLeft(y));
	$: mobile ? d3.select(gx).call(d3.axisBottom(x)) : d3.select(gx).call(d3.axisTop(x));
	/**
	 * @type {d3.brushX | d3.brushY}
	 */
	let brush;
	$: {
		brush = mobile
			? d3.brushX().extent([
					[marginLeft, 0],
					[width - marginRight, height - marginBottom - marginTop]
				])
			: d3.brushY().extent([
					[marginLeft, marginTop],
					[width - marginRight, height - marginBottom]
				]);
		brush
			.on('brush', (/** @type {{ selection: [number, number]; }} */ e) => {
				const from = mobile ? e.selection[0] : e.selection[1];
				const to = mobile ? e.selection[1] : e.selection[0];
				if (Math.abs(from - to) <= 180) {
					const start = Math.round(valuesDim.invert(from));
					const end = Math.round(valuesDim.invert(to));

					dispatch('brush', { start, end });
				}
			})
			.on('end', (/** @type {{ selection: [number, number]; }} */ e) => {
				const from = mobile ? e.selection[0] : e.selection[1];
				const to = mobile ? e.selection[1] : e.selection[0];
				if (Math.abs(from - to) > 180) {
					const start = Math.round(valuesDim.invert(from));
					const end = Math.round(valuesDim.invert(to));

					dispatch('brush', { start, end });
				}
			});
	}
	$: d3.select(gBrush)
		.call(brush)
		.call(
			brush.move,
			mobile ? [valuesDim(DATA_MIN), valuesDim(100)] : [valuesDim(100), valuesDim(DATA_MIN)]
		);
</script>

<svg {width} {height} class="float-left" shape-rendering="crispEdges">
	<g bind:this={gy} transform="translate({marginLeft - 5} ,0)" />
	<g bind:this={gx} transform="translate(0,{mobile ? height - marginBottom : marginTop - 1})" />
	{#each chunkedData as d}
		<g>
			{#each d.values as v, j}
				{@const start = xChunk(j)}
				{@const end = xChunk(j + 1)}
				<rect
					x={mobile ? start : x(d.label)}
					y={mobile ? y(d.label) : start}
					width={mobile ? end - start : x.bandwidth()}
					height={mobile ? y.bandwidth() : end - start}
					fill={`rgb(var(--color-primary-${colorScale(v)}))`}
				/>
			{/each}
		</g>
	{/each}
	<g bind:this={gBrush} transform="translate(0,{mobile ? marginTop : 0})" />
</svg>
