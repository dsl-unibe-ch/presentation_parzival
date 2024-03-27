<script>
	import * as d3 from 'd3';
	import { computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { base } from '$app/paths';

	export let width = 400;
	export let height = 400;
	export let data_start = 1;
	/**
	 * @type {{values: boolean[], label: string}[]}
	 */
	export let data = [];
	let marginTop = 20;
	let marginRight = 20;
	let marginBottom = 20;
	let marginLeft = 25;

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
	};

	/**
	 * @param {d3.scaleBand<string>} scale
	 */
	function scaleBandInvert(scale) {
		const domain = scale.domain();
		const paddingOuter = scale(domain[0]);
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
	$: manuscript = scaleBandInvert(x)(mousePos[0]);

	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: verse = Math.floor(y.invert(mousePos[1]));
</script>

<div
	class="card p-1 variant-filled-primary fixed top-0 left-0 w-max"
	data-popup="popupVerse"
	bind:this={floating}
>
	<p>{manuscript} {verse}</p>
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
			<g data-manuscript={sigla.label}>
				{#each sigla.values as hasVerse, i}
					{#if hasVerse}
						{@const verseNumber = i + data_start}
						{#if Array.isArray(hasVerse)}
							<rect
								x={x(sigla.label)}
								y={y(verseNumber + 1)}
								width={x.bandwidth()}
								height={y(verseNumber) - y(verseNumber + 1)}
								fill="currentColor"
								class="hover:text-secondary-900"
								on:click={() => {
									console.log(hasVerse);
								}}
								role="button"
								tabindex="0"
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										console.log(hasVerse);
									}
								}}
							/>
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
