<script>
	import * as d3 from 'd3';
	import { base } from '$app/paths';

	export let width = 400;
	export let height = 150;
	let marginTop = 20;
	let marginRight = 20;
	let marginBottom = 20;
	let marginLeft = 20;

	/**
	 * @type {SVGGElement}
	 */
	let gx;
	/**
	 * @type {SVGGElement}
	 */
	let gy;
	/**
	 * @type {number[]}
	 */
	let mousePos = [0, 1];

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

	const handleMouseMove = (/** @type {{ clientX: any; clientY: any; }} */ event) => {
		mousePos = d3.pointer(event);
	};

	$: y = d3
		.scaleBand(
			data.map((d) => d.label),
			[height - marginTop, marginBottom]
		)
		.round(true)
		.paddingOuter(0.1)
		.paddingInner(0.2);
	$: x = d3.scaleLinear([1, 822], [marginRight, width - marginLeft]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: verse = Math.round(x.invert(mousePos[1]));
</script>

<svg {width} {height}>
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	{#each data as sigla}
		{#each sigla.values as [start, end]}{/each}
	{/each}
</svg>
