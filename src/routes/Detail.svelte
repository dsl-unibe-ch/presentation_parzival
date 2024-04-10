<script>
	import * as d3 from 'd3';
	import { computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { base } from '$app/paths';
	import { popup } from '@skeletonlabs/skeleton';

	export let width = 400;
	export let height = 400;
	export let data_start = 1;
	/**
	 * @type {{values: boolean[], label: string}[]}
	 */
	export let data = [];
	let marginTop = 30;
	let marginRight = 0;
	let marginBottom = 20;
	let marginLeft = 35;

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

	/**
	 * @type {HTMLElement}
	 */
	let floating;

	/**
	 * @type {SVGElement}
	 */
	let svgElement;

	const handleMouseMove = (/** @type {{ clientX: any; clientY: any; }} */ event) => {
		mousePos = d3.pointer(event, svgElement);
		if (mousePos[0] >= marginLeft && mousePos[1] >= marginTop) {
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
				middleware: [offset(15), flip(), shift()],
				strategy: 'fixed'
			}).then(({ x, y }) => {
				Object.assign(floating.style, {
					left: `${x}px`,
					top: `${y}px`,
					opacity: '1',
					display: 'block'
				});
			});
		} else {
			floating.style.display = 'none';
			floating.style.opacity = '0';
		}
	};

	/**
	 * @param { import('d3').ScaleBand<string> } scale
	 */
	function scaleBandInvert(scale) {
		const domain = scale.domain();
		const paddingOuter = scale(domain[0]) ?? 0;
		const eachBand = scale.step();
		return function (/** @type {number} */ value) {
			const index = Math.floor((value - paddingOuter) / eachBand);
			return domain[Math.max(0, Math.min(index, domain.length - 1))];
		};
	}
	$: x = d3
		.scaleBand(
			data.map((d) => d.label),
			[marginLeft, width - marginRight]
		)
		.round(true)
		.paddingOuter(0.1)
		.paddingInner(0.2);

	$: y = d3.scaleLinear(
		[data_start, data_start + data[0]?.values.length],
		[height - marginBottom, marginTop]
	);
	$: manuscript =
		scaleBandInvert(x)(mousePos[0]) === 'fr'
			? data.find((d) => d.label === 'fr')?.values[verse - data_start] || 'fr'
			: scaleBandInvert(x)(mousePos[0]);

	$: d3.select(gy)
		.call(
			d3
				.axisRight(y)
				.ticks(20)
				.tickSize(width - marginLeft - marginRight)
		)
		.call((/** @type import('d3-selection').Selection<SVGGElement, any, null, undefined> */ g) => {
			g.selectAll('.tick text').attr('x', -25);
		});
	$: d3.select(gx).call(d3.axisTop(x));

	$: verse = Math.floor(y.invert(mousePos[1]));
</script>

<div
	class="card p-1 variant-filled-primary fixed top-0 left-0 w-max"
	data-popup="popupVerse"
	bind:this={floating}
>
	{#if Array.isArray(manuscript)}
		<ul>
			{#each manuscript as sigla}
				<li>
					<a href={`${base}/textzeugen/${sigla}/${verse}`} class="hover:text-secondary-900">
						{sigla}
						{verse}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>{manuscript} {verse}</p>
	{/if}
</div>
{#each data.find((d) => d.label === 'fr').values as fraction, i}
	{#if Array.isArray(fraction)}
		{@const verse = i + data_start}
		<div
			class="card p-1 variant-filled-primary fixed top-0 left-0 w-max"
			data-popup="popupFractions-{verse}"
		>
			<ul>
				{#each fraction as sigla}
					<li>
						<a href={`${base}/textzeugen/${sigla}/${verse}`} class="hover:text-secondary-900">
							{sigla}
							{verse}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{/each}
<div
	on:mousemove={handleMouseMove}
	on:mouseleave={(_e) => {
		floating.style.display = 'none';
		floating.style.opacity = '0';
	}}
	role="application"
	class="mt-6"
>
	<svg {width} {height} bind:this={svgElement}>
		<g bind:this={gx} transform="translate(0,{marginTop})" class="x-axis" />
		<g bind:this={gy} transform="translate({marginLeft},0)" class="y-axis" />
		{#each data as sigla}
			<g data-manuscript={sigla.label}>
				{#each sigla.values as hasVerse, i}
					{#if hasVerse}
						{@const verseNumber = i + data_start}
						{#if Array.isArray(hasVerse)}
							{#if hasVerse.length === 1}
								<a
									href={`${base}/textzeugen/${hasVerse[0]}/${verseNumber}`}
									class="hover:text-secondary-900"
								>
									<rect
										x={x(sigla.label)}
										y={y(verseNumber + 1)}
										width={x.bandwidth()}
										height={y(verseNumber) - y(verseNumber + 1)}
										fill="currentColor"
										class="hover:text-secondary-900"
									/>
								</a>
							{:else}
								<rect
									x={x(sigla.label)}
									y={y(verseNumber + 1)}
									width={x.bandwidth()}
									height={y(verseNumber) - y(verseNumber + 1)}
									fill="currentColor"
									class="hover:text-secondary-900"
									role="button"
									tabindex="0"
									use:popup={{
										event: 'focus-blur',
										target: 'popupFractions-' + verseNumber,
										placement: 'top'
									}}
								/>
							{/if}
						{:else}
							<a
								href={`${base}/textzeugen/${sigla.label}/${verseNumber}`}
								class="hover:text-secondary-900"
							>
								<rect
									x={x(sigla.label)}
									y={y(verseNumber + 1)}
									width={x.bandwidth()}
									height={y(verseNumber) - y(verseNumber + 1)}
									fill="currentColor"
									class="hover:text-secondary-900"
								/>
							</a>
						{/if}
					{/if}
				{/each}
			</g>
		{/each}
	</svg>
</div>

<style>
	.x-axis :global(text) {
		font-size: 1rem;
	}

	.y-axis :global(.tick line) {
		stroke-opacity: 0.5;
		stroke-dasharray: 2, 2;
	}
</style>
