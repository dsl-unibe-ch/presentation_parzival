<script>
	import * as d3 from 'd3';
	import { computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { base } from '$app/paths';

	export let width = 400;
	export let height = 400;
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
	 * @type {HTMLElement}
	 */
	let floating;

	const handleMouseMove = (/** @type {{ clientX: any; clientY: any; }} */ event) => {
		mousePos = d3.pointer(event);
		const virtualEl = {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: event.clientX,
					y: event.clientY,
					left: event.clientX,
					right: event.clientX,
					top: event.clientY,
					bottom: event.clientY
				};
			}
		};

		computePosition(virtualEl, floating, {
			placement: 'right-start',
			middleware: [offset(15), flip(), shift()]
		}).then(({ x, y }) => {
			floating.style.left = `${x}px`;
			floating.style.top = `${y}px`;
			floating.style.opacity = '1';
			floating.style.display = 'block';
		});
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

<div
	class="card p-1 variant-filled-secondary absolute"
	data-popup="popupVerse"
	bind:this={floating}
>
	<p>{verse}</p>
</div>

<div
	on:mousemove={handleMouseMove}
	on:mouseleave={(_e) => {
		floating.style.display = 'none';
		floating.style.opacity = '0';
	}}
	role="application"
>
	<svg {width} {height}>
		<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
		<g bind:this={gy} transform="translate({marginLeft},0)" />
		{#each data as sigla}
			{#each sigla.values as [start, end]}
				<a href={`${base}/textzeugen/${sigla.label}/${verse}`}>
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
</div>
