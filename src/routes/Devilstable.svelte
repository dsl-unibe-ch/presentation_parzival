<script>
	import * as d3 from 'd3';
	import { base } from '$app/paths';
	import { popup } from '@skeletonlabs/skeleton';

	let width = 400;
	let height = 400;
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
	/**
	 * @type {import('@skeletonlabs/skeleton').PopupSettings}
	 */
	const popupVerse = {
		event: 'hover',
		target: 'popupVerse',
		placement: 'top'
	};

	$: x = d3
		.scaleBand(
			data.map((d) => d.label),
			[marginLeft, width - marginRight]
		)
		.round(true)
		.paddingOuter(0.1)
		.paddingInner(0.2);
	$: y = d3.scaleLinear(d3.extent(data.flatMap((d) => d.values.flat())), [
		height - marginBottom,
		marginTop
	]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: verse = Math.round(y.invert(mousePos[1]));
</script>

<div class="card p-4 variant-filled-secondary" data-popup="popupVerse">
	<p>{verse}</p>
	<div class="arrow variant-filled-secondary" />
</div>

<svg width="400" height="400" role="application">
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	{#each data as sigla}
		{#each sigla.values as [start, end]}
			<a
				href={`${base}/textzeugen/${sigla.label}/${verse}`}
				on:mousemove={(e) => (mousePos = d3.pointer(e))}
				use:popup={popupVerse}
			>
				<rect
					x={x(sigla.label)}
					y={y(end)}
					width={x.bandwidth()}
					height={y(start) - y(end)}
					fill="currentColor"
				/>
			</a>
		{/each}
	{/each}
</svg>
